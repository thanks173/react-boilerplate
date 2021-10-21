import React, { useRef, useEffect } from 'react'

function Modal(props: any) {
  const { open, setOpen, children } = props
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    function handleClick(event: any) {
      if (wrapperRef?.current && !wrapperRef?.current?.contains(event.target)) {
        handleClose()
      }
    }

    if (!open) {
      document.removeEventListener('click', handleClick, { capture: true })
      return
    }

    document.addEventListener('click', handleClick, { capture: true })
    return () => {
      document.removeEventListener('click', handleClick, { capture: true })
    }
  }, [wrapperRef, open])

  return (
    <>
      <div className={`modal bg-blue-gray-800 bg-opacity-60 items-center lg:pb-40 ${open ? 'modal-open' : ''}`}>
        <div ref={wrapperRef}>{children}</div>
      </div>
    </>
  )
}

export default Modal
