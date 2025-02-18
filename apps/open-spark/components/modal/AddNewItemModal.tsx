import BottomModalScan from '@beckn-ui/common/src/components/BottomModal/BottomModalScan'
import { Button, GenericDropdown, Input, Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button'
import { Box, Flex, HStack, Icon, VStack } from '@chakra-ui/react'
import { InputProps, ButtonProps } from '@beckn-ui/molecules'
import React, { useEffect, useState } from 'react'
import { testIds } from '@shared/dataTestIds'
import DragAndDropUpload from '@components/dragAndDropUpload'
import { FiPlusCircle } from 'react-icons/fi'
import RenderDocuments from '@components/documentsRenderer'
import uploadIcon from '@public/images/upload_file_icon.svg'

interface DocumentProps {
  id?: string
  icon: string
  title: string
  date: Date
  file?: any
  data?: any
}

interface DeleteAlertModalProps {
  isOpen: boolean
  onClose: () => void
  isLoading?: boolean
  schema: {
    header: string
    inputs: InputProps[]
    buttons: ButtonProps[]
  }
  renderFileUpload?: boolean
  clearDocuments?: boolean
  handleOnFileselectionChange?: (data: DocumentProps[]) => void
}

const AddNewItemModal = (props: DeleteAlertModalProps) => {
  const { isOpen, onClose, isLoading, schema, renderFileUpload, handleOnFileselectionChange, clearDocuments } = props
  const { inputs, header, buttons } = schema

  const [selectedFile, setSelectedFile] = useState<DocumentProps[]>([])
  const [allFilesProcessed, setAllFilesProcessed] = useState<boolean>(false)

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      const docs = files.map(file => {
        return { title: file?.name!, icon: uploadIcon, date: new Date(), file: file }
      })
      // setSelectedFile(prevState => (prevState ? [...prevState, ...docs] : docs))
      setSelectedFile(docs)
    }
  }

  const handleOnDelete = (index: number, document: DocumentProps, type: 'cred' | 'upload') => {
    setSelectedFile(prevState => prevState!.filter((_, i) => i !== index))
  }

  useEffect(() => {
    handleOnFileselectionChange?.(selectedFile)
  }, [selectedFile])

  useEffect(() => {
    if (clearDocuments) {
      setSelectedFile([])
      setAllFilesProcessed(false)
    }
  }, [clearDocuments])

  return (
    <Box>
      <BottomModalScan
        isOpen={isOpen}
        onClose={onClose}
        modalHeader={header}
        isLoading={isLoading}
      >
        <Box
          alignItems="center"
          flexDir="column"
          padding="0 20px 0 20px"
          gap="10px"
        >
          <Box mt="10px">
            {inputs.map((singleInput, index) => {
              if (singleInput.type === 'select') {
                return (
                  <GenericDropdown
                    key={index}
                    name={singleInput.name!}
                    options={singleInput.options!}
                    placeholder={singleInput.label}
                    selectedValue={singleInput?.value || ''}
                    handleChange={singleInput.handleChange as any}
                    buttonStyles={{ marginBottom: '35px' }}
                  />
                )
              }
              return (
                <Input
                  dataTest={singleInput.dataTest}
                  key={index}
                  {...singleInput}
                />
              )
            })}
            {renderFileUpload && (
              <Box marginBottom={'1rem'}>
                {/* <Typography
                  text="Upload a file"
                  dataTest={testIds.upload_file}
                  fontWeight="600"
                  fontSize="16px"
                  style={{
                    marginTop: '1rem'
                  }}
                />
                <Typography
                  text="File upload description"
                  dataTest={testIds.File_upload_description}
                /> */}
                {selectedFile.length === 0 && (
                  <DragAndDropUpload
                    multiple={false}
                    accept={'*'}
                    dragAndDrop={true}
                    setFiles={handleFileChange}
                    fileSelectionElement={(fileInputRef: any) => {
                      return (
                        <Box
                          width={'100%'}
                          height={'100%'}
                          onClick={() => {
                            if (fileInputRef.current) {
                              fileInputRef.current.click()
                            }
                          }}
                        >
                          <VStack>
                            <Icon
                              as={FiPlusCircle}
                              boxSize={6}
                              color="gray.500"
                            />
                            <Typography
                              text={'Upload your file here'}
                              dataTest={testIds.drop_your_file_here}
                            />
                            <HStack gap={1}>
                              <Typography
                                dataTest={testIds.Browse_file}
                                color="#4498E8"
                                fontSize="10px"
                                sx={{ cursor: 'pointer', _hover: { textDecoration: 'underline' } }}
                                text="Browse file"
                              />{' '}
                              <Typography
                                fontSize="10px"
                                text={'from your computer'}
                              />
                            </HStack>
                          </VStack>
                        </Box>
                      )
                    }}
                  />
                )}
                <RenderDocuments
                  list={selectedFile || []}
                  type="upload"
                  handleOnDelete={handleOnDelete}
                  onAllComplete={status => {
                    setAllFilesProcessed(status)
                  }}
                />
              </Box>
            )}
          </Box>
          {buttons.map(singleButton => {
            return (
              <Button
                dataTest={singleButton.dataTest}
                key={singleButton.text}
                {...singleButton}
              />
            )
          })}
        </Box>
      </BottomModalScan>
    </Box>
  )
}

export default AddNewItemModal
