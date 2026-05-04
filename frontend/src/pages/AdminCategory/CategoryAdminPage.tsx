import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DefaultLayout from "../../components/layout/DefaultLayout";
import ProductService from "../../services/productService";
import notify from "../../utils/notify";
import { ROUTES } from "../../constants/routes";
import "./CategoryAdminPage.scss";

export type CategoryRow = {
  id: number;
  name: string;
  parentCategory?: string | null;
};

const PARENT_OPTIONS = [
  { value: "tops", label: "上衣" },
  { value: "bottoms", label: "下身" },
  { value: "onePiece", label: "連身" },
  { value: "others", label: "其他" },
] as const;

type ParentValue = (typeof PARENT_OPTIONS)[number]["value"];

const CategoryAdminPage = () => {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState<ParentValue>("others");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const data = (await ProductService.getAllCategories()) as CategoryRow[];
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      notify.error("無法載入分類列表");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    loadCategories(ac.signal);
    return () => ac.abort();
  }, [loadCategories]);

  const resetForm = () => {
    setName("");
    setParentCategory("others");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      notify.info("請輸入分類名稱");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId != null) {
        await ProductService.updateCategory(editingId, { name: trimmed, parentCategory });
        notify.success("分類已更新");
      } else {
        await ProductService.createCategory({ name: trimmed, parentCategory });
        notify.success("分類已新增");
      }
      resetForm();
      await loadCategories();
    } catch (err) {
      console.error(err);
      notify.error(editingId != null ? "更新失敗，請確認權限或名稱是否重複" : "新增失敗，請確認權限或名稱是否重複");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (row: CategoryRow) => {
    setEditingId(row.id);
    setName(row.name);
    const p = row.parentCategory as ParentValue | undefined;
    setParentCategory(PARENT_OPTIONS.some((o) => o.value === p) ? (p as ParentValue) : "others");
  };

  const handleDelete = async (row: CategoryRow) => {
    const ok = await notify.confirm(`確定刪除「${row.name}」？`, {
      title: "刪除分類",
      variant: "destructive",
      confirmText: "刪除",
      cancelText: "取消",
    });
    if (!ok) return;
    try {
      await ProductService.deleteCategory(row.id);
      notify.success("已刪除");
      if (editingId === row.id) resetForm();
      await loadCategories();
    } catch (err) {
      console.error(err);
      notify.error("刪除失敗（可能仍有商品使用此分類）");
    }
  };

  return (
    <DefaultLayout>
      <div className="category-admin">
        <div className="container category-admin__inner">
          <header className="category-admin__head">
            <h1 className="category-admin__title">分類管理</h1>
            <Link to={ROUTES.HOME} className="category-admin__back">
              返回首頁
            </Link>
          </header>

          <p className="category-admin__hint">僅限管理員。大分類對應 Header 分組；小分類即分類名稱。</p>

          <form className="category-admin__form" onSubmit={handleSubmit}>
            <div className="category-admin__field">
              <label htmlFor="cat-name">分類名稱</label>
              <input id="cat-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：T恤" maxLength={120} />
            </div>
            <div className="category-admin__field">
              <label htmlFor="cat-parent">大分類</label>
              <select id="cat-parent" value={parentCategory} onChange={(e) => setParentCategory(e.target.value as ParentValue)}>
                {PARENT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="category-admin__actions">
              <button type="submit" className="category-admin__btn category-admin__btn--primary" disabled={submitting}>
                {editingId != null ? "儲存變更" : "新增分類"}
              </button>
              {editingId != null && (
                <button type="button" className="category-admin__btn category-admin__btn--ghost" onClick={resetForm} disabled={submitting}>
                  取消編輯
                </button>
              )}
            </div>
          </form>

          {loading ? (
            <p className="category-admin__loading">載入中...</p>
          ) : (
            <div className="category-admin__table-wrap">
              <table className="category-admin__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>名稱</th>
                    <th>大分類</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="category-admin__empty">
                        尚無分類
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => {
                      const label = PARENT_OPTIONS.find((o) => o.value === row.parentCategory)?.label ?? row.parentCategory ?? "—";
                      return (
                        <tr key={row.id} className={editingId === row.id ? "category-admin__row--active" : undefined}>
                          <td>{row.id}</td>
                          <td>{row.name}</td>
                          <td>{label}</td>
                          <td className="category-admin__row-actions">
                            <button type="button" className="category-admin__btn category-admin__btn--small" onClick={() => handleEdit(row)}>
                              編輯
                            </button>
                            <button type="button" className="category-admin__btn category-admin__btn--small category-admin__btn--danger" onClick={() => handleDelete(row)}>
                              刪除
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CategoryAdminPage;
