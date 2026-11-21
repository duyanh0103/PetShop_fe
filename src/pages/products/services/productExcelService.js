import { SKU_STANDARD, SKU_STANDARD_MESSAGE } from "../schemas/productSchema";

// exceljs is ~1MB, so it is loaded only when an admin actually imports or exports.
const loadExcelJS = () => import("exceljs").then((module) => module.default);

const SHEET_NAME = "SanPham";
const COLUMNS = [
  { header: "SKU", key: "sku", width: 16 },
  { header: "Tên sản phẩm", key: "name", width: 32 },
  { header: "Danh mục", key: "categories", width: 32 },
  { header: "Giá", key: "price", width: 14 },
  { header: "Số lượng", key: "quantity", width: 12 },
  { header: "Đang bán", key: "isActive", width: 12 },
  { header: "Mô tả", key: "description", width: 40 },
  { header: "Ảnh (URL)", key: "imageUrl", width: 40 },
];
const YES = ["co", "có", "x", "1", "true", "yes"];
const NO = ["khong", "không", "0", "false", "no"];

const normalizeKey = (value) => String(value ?? "").trim().toLowerCase();
const REQUIRED_HEADERS = ["sku", "name", "categories", "price"];

// exceljs returns rich text, hyperlinks and formulas as objects.
function cellText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    if (Array.isArray(value.richText)) return value.richText.map((part) => part.text).join("").trim();
    if ("text" in value) return String(value.text).trim();
    if ("result" in value) return String(value.result ?? "").trim();
  }
  return String(value).trim();
}

async function downloadWorkbook(workbook, fileName) {
  const buffer = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function addProductSheet(workbook) {
  const sheet = workbook.addWorksheet(SHEET_NAME);
  sheet.columns = COLUMNS;
  sheet.getRow(1).font = { bold: true };
  return sheet;
}

async function downloadTemplate(categories = []) {
  const ExcelJS = await loadExcelJS();
  const workbook = new ExcelJS.Workbook();
  const sheet = addProductSheet(workbook);
  const exampleCategories = categories.slice(0, 2).map((category) => category.name).join(", ");
  sheet.addRow({
    sku: "BOW70_GTD_1",
    name: "Pate Bite of Wild Goat Milk gà tây & dừa cho mèo - 70g",
    categories: exampleCategories,
    price: 25000,
    quantity: 50,
    isActive: "Có",
  });
  sheet.addRow({
    sku: "BOW70_MIX_12",
    name: "Pate Bite of Wild Goat Milk mix 2 vị gà cho mèo - 70g x 12 gói",
    categories: exampleCategories,
    price: 280000,
    quantity: 10,
    isActive: "Có",
  });

  const guide = workbook.addWorksheet("HuongDan");
  guide.columns = [{ width: 24 }, { width: 70 }];
  guide.addRows([
    ["Cột", "Cách điền"],
    ["SKU", "Bắt buộc. MÃDÒNG+GRAM_MÃVỊ_SỐGÓI. Mã vị = chữ đầu mỗi thành phần, MIX nếu trộn vị. VD: BOW70_GTD_1, BOW70_MIX_12."],
    ["Tên sản phẩm", "Bắt buộc. {Loại} {Thương hiệu/Dòng} {Vị} cho {Thú} - {Gram}, thêm \"x N gói\" nếu N > 1."],
    ["Danh mục", "Bắt buộc. Một hoặc nhiều tên, cách nhau bằng dấu phẩy. Tên đầu tiên là danh mục chính."],
    ["Giá", "Bắt buộc, số >= 0, đơn vị đồng."],
    ["Số lượng", "Số nguyên >= 0. Để trống = 0."],
    ["Đang bán", "Có / Không. Để trống = Có."],
    ["Mô tả, Ảnh (URL)", "Không bắt buộc."],
    ["Cột khác", "Bị bỏ qua. Hệ thống đọc cột theo tên tiêu đề ở dòng 1, không theo thứ tự."],
    [],
    ["Danh mục hiện có", ""],
    ...categories.map((category) => [category.name, category.type === "BRAND" ? "Thương hiệu" : "Danh mục"]),
  ]);
  guide.getRow(1).font = { bold: true };
  guide.getRow(10).font = { bold: true };

  await downloadWorkbook(workbook, "mau-nhap-san-pham.xlsx");
}

async function exportProducts(products) {
  const ExcelJS = await loadExcelJS();
  const workbook = new ExcelJS.Workbook();
  const sheet = addProductSheet(workbook);
  products.forEach((product) => {
    sheet.addRow({
      sku: product.sku,
      name: product.name,
      categories: (product.categories ?? []).map((category) => category.name).join(", "),
      price: Number(product.price),
      quantity: product.quantity,
      isActive: product.isActive ? "Có" : "Không",
      description: product.description ?? "",
      imageUrl: product.imageUrl ?? "",
    });
  });

  await downloadWorkbook(workbook, `san-pham-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// Returns one plain object per non-empty row, keyed by COLUMNS[].key, plus its sheet row number.
async function parseExcelFile(file) {
  const ExcelJS = await loadExcelJS();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());
  const sheet = workbook.getWorksheet(SHEET_NAME) ?? workbook.worksheets[0];

  if (!sheet) {
    throw new Error("File Excel không có dữ liệu.");
  }

  // Columns are found by header text, so reordered sheets and extra columns still work.
  const columnIndex = {};
  sheet.getRow(1).eachCell((cell, index) => {
    const column = COLUMNS.find((item) => normalizeKey(item.header) === normalizeKey(cellText(cell.value)));
    if (column) columnIndex[column.key] = index;
  });
  const missing = COLUMNS.filter((column) => REQUIRED_HEADERS.includes(column.key) && !columnIndex[column.key]);
  if (missing.length > 0) {
    throw new Error(`Thiếu cột: ${missing.map((column) => column.header).join(", ")}. Vui lòng dùng file mẫu.`);
  }

  const rows = [];
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    const record = { rowNumber };
    COLUMNS.forEach((column) => {
      record[column.key] = columnIndex[column.key] ? cellText(row.getCell(columnIndex[column.key]).value) : "";
    });
    if (COLUMNS.some((column) => record[column.key] !== "")) rows.push(record);
  });

  return rows;
}

// Turns parsed rows into API payloads. The API stays the final judge (e.g. duplicate SKU in the DB).
function validateRows(rows, categories = []) {
  const categoryByName = new Map(categories.map((category) => [normalizeKey(category.name), category]));
  const seenSkus = new Set();
  const validRows = [];
  const errors = [];

  rows.forEach((row) => {
    const fail = (message) => errors.push({ row: row.rowNumber, message });
    const name = row.name;
    const sku = row.sku.toUpperCase();
    const categoryNames = row.categories.split(",").map((value) => value.trim()).filter(Boolean);
    const matched = categoryNames.map((value) => categoryByName.get(normalizeKey(value)));
    const price = Number(String(row.price).replace(/[.,\s]/g, ""));
    const quantity = row.quantity === "" ? 0 : Number(row.quantity);
    const activeKey = normalizeKey(row.isActive);

    if (!sku) return fail("Thiếu SKU.");
    if (!SKU_STANDARD.test(sku)) return fail(`${sku}: ${SKU_STANDARD_MESSAGE}`);
    if (!name) return fail("Thiếu tên sản phẩm.");
    if (categoryNames.length === 0) return fail("Thiếu danh mục.");
    const missingIndex = matched.findIndex((category) => !category);
    if (missingIndex !== -1) return fail(`Không có danh mục "${categoryNames[missingIndex]}".`);
    if (row.price === "" || !Number.isFinite(price) || price < 0) return fail("Giá phải là số >= 0.");
    if (!Number.isInteger(quantity) || quantity < 0) return fail("Số lượng phải là số nguyên >= 0.");
    if (activeKey && !YES.includes(activeKey) && !NO.includes(activeKey)) return fail('Cột "Đang bán" chỉ nhận Có hoặc Không.');
    if (seenSkus.has(sku)) return fail(`SKU ${sku} bị trùng trong file.`);
    seenSkus.add(sku);

    validRows.push({
      rowNumber: row.rowNumber,
      payload: {
        name,
        sku,
        categoryIds: [...new Set(matched.map((category) => category.id))],
        price,
        quantity,
        isActive: !NO.includes(activeKey),
        description: row.description || null,
        imageUrl: row.imageUrl || null,
      },
    });
  });

  return { validRows, errors };
}

const productExcelService = {
  downloadTemplate,
  exportProducts,
  parseExcelFile,
  validateRows,
};

export default productExcelService;
