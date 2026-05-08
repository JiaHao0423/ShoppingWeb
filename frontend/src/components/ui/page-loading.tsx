import "./page-loading.scss";

type PageLoadingProps = {
  /** 讀螢軟體用：簡短說明目前狀態 */
  label?: string;
};

/** 路由 Suspense、受保護頁面等共用的全頁載入提示 */
export function PageLoading({ label = "載入中..." }: PageLoadingProps) {
  return (
    <div className="page-loading" role="status" aria-live="polite" aria-busy="true">
      <span className="page-loading__text">{label}</span>
    </div>
  );
}
