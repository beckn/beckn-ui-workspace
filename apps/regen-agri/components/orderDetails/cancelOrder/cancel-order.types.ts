export interface CancellationType {
    id: string
    cancellationTypeText: string
    checked?: boolean
}

export interface CancelOrderPropsModel {
    cancelOrderModalClose: () => void
    cancellationType: CancellationType[]
    handleCheckboxChange: (id: string) => void
    handleCancelButtonClick: () => Promise<void>
}
