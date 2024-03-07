import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations('Home')
  // TODO :- This is an example component to test the bootstrap styling
  return (
    <>
      <div className="modal d-block">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content text-center p-3">
            <img
              src="assets/images/Loading.svg"
              width={'60px'}
              height={'60px'}
              className="m-auto my-3"
              alt="image-showing-the-loading-text"
            />
            <p className="mb-0">{t('title')}</p>
            <p className="text-muted small mb-0">while processing your request!</p>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  )
}
