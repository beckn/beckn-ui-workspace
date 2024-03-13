import { useState } from 'react'
import { Transition } from '@headlessui/react'
import { AiOutlineClose } from 'react-icons/ai'
import { useLanguage } from '../../hooks/useLanguage'
import { Image } from '@chakra-ui/react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    partialClose?: boolean
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    partialClose,
}) => {
    const { t } = useLanguage()
    return (
        <Transition
            show={isOpen}
            onClick={() => onClose()}
        >
            <div className="fixed z-[9999] inset-0 flex items-end justify-center  sm:p-0 bg-[#80808066] ">
                <Transition.Child
                    unmount={false}
                    enter="transition-transform duration-300"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transition-transform duration-300"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                    style={{ width: '100vw' }}
                >
                    <div className="w-full   px-4 pb-4 pt-2 mx-auto bg-[#fff]  rounded-t-[1rem] shadow-lg sm:rounded-lg sm:overflow-hidden">
                        <Image
                            src="/images/Indicator.svg"
                            className="mx-auto mb-3"
                            alt="indicator"
                        />
                        {children}
                    </div>
                </Transition.Child>
            </div>
        </Transition>
    )
}

export default Modal
