import { Box, Flex, Image, Progress } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { formatDate } from '@beckn-ui/common'
import { Typography } from '@beckn-ui/molecules'
import deleteIcon from '@public/images/delete_icon.svg'
import tickIcon from '@public/images/tick.svg'
import { formatFileSize } from '@utils/general'
import { testIds } from '@shared/dataTestIds'

export interface DocumentProps {
  icon: string
  title: string
  date: Date
  file?: any
  data?: any
}

interface RenderDocumentsProps {
  list: DocumentProps[]
  type: 'cred' | 'upload'
  handleOnDelete?: (index: number, document: DocumentProps, type: 'cred' | 'upload') => void
  onAllComplete?: (completed: boolean) => void
}

const RenderDocuments = (props: RenderDocumentsProps) => {
  const { list, type, handleOnDelete, onAllComplete } = props

  const [progressList, setProgressList] = useState<number[]>([])

  useEffect(() => {
    let intervals: any[] = []
    if (type === 'upload') {
      intervals = list.map((_, index) => {
        if (progressList[index] === undefined || progressList[index] < 100) {
          return setInterval(() => {
            setProgressList(prev => {
              const newProgress = { ...prev }
              if (newProgress[index] === undefined) newProgress[index] = 0

              if (newProgress[index] < 100) {
                const randomIncrement = Math.floor(Math.random() * 10) + 1
                newProgress[index] = Math.min(newProgress[index] + randomIncrement, 100)
              }
              return newProgress
            })
          }, 200)
        }
      })
    }
    return () => {
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [list, progressList])

  useEffect(() => {
    const completed = list.every((_, index) => progressList[index] === 100)
    onAllComplete?.(completed)
  }, [progressList, list, onAllComplete])

  return (
    <>
      {list.map((document, index) => {
        const progress: number = progressList[index] || 0
        return (
          <Flex
            border={'1px solid #BFBFBF'}
            borderRadius="1rem"
            padding="1rem"
            justifyContent={'space-between'}
            key={index}
            height="78px"
            marginTop={'0.8rem'}
          >
            <Flex width="100%">
              <Image
                src={document.icon}
                alt="doc_type"
                data-test={testIds.document_upload_icon}
              />
              <Flex
                flexDirection={'column'}
                alignSelf={'center'}
                marginLeft="1rem"
                width="100%"
              >
                <Typography
                  text={document.title}
                  dataTest={testIds.document_title}
                  fontWeight="600"
                  sx={{
                    maxWidth: '10rem',
                    noOfLines: 2,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word'
                  }}
                />
                {type === 'cred' ? (
                  <Typography
                    text={formatDate(document.date, "dd MMM yyyy 'at' hh:mm a")}
                    dataTest={testIds.document_uplaod_date}
                  />
                ) : (
                  <>
                    <Typography
                      text={formatFileSize(document.file.size)}
                      fontWeight="400"
                    />
                    <Progress
                      value={progress}
                      borderRadius="2rem"
                      height="6px"
                    />
                  </>
                )}
              </Flex>
              {type === 'upload' && (
                <Typography
                  text={`${progress}%`}
                  style={{
                    alignContent: 'end',
                    margin: '1.95rem 0 0 1rem'
                  }}
                  fontWeight="400"
                />
              )}
            </Flex>
            <Flex
              flexDir={'column'}
              justifyContent="space-between"
              gap="1rem"
            >
              {handleOnDelete && (
                <Image
                  src={deleteIcon}
                  alt="delete"
                  alignSelf={'center'}
                  width={'16px'}
                  height={'16px'}
                  data-test={testIds.delete_Icon}
                  cursor="pointer"
                  onClick={() => handleOnDelete(index, document, type)}
                />
              )}
              {type === 'upload' && progress === 100 && (
                <Image
                  src={tickIcon}
                  alt="tick"
                  alignSelf={'center'}
                  width={'16px'}
                  height={'16px'}
                  cursor="pointer"
                />
              )}
            </Flex>
          </Flex>
        )
      })}
    </>
  )
}

export default RenderDocuments
