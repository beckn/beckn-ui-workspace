import { Button } from '@beckn-ui/molecules'
import { ChakraProvider, FormControl, FormLabel, Input, extendTheme, Box, Select, Flex } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useState } from 'react'

const activeLabelStyles = {
  transform: 'scale(1) translateY(-24px)'
}

export const theme = extendTheme({
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles
              }
            },
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label':
              {
                ...activeLabelStyles
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: 'absolute',
              backgroundColor: 'white',
              pointerEvents: 'none',
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: 'left top'
            }
          }
        }
      }
    }
  }
})

export default function AssemblyDetails() {
  const [count, setCount] = useState(100)
  const [formData, setFormData] = useState({
    type: '',
    colour: '',
    shape: '',
    length: '',
    width: '',
    quantity: count,
    weight: ''
  })

  function increment() {
    setCount(prevCount => prevCount + 1)
    setFormData(prevData => ({ ...prevData, quantity: count + 1 }))
  }

  function decrement() {
    if (count > 0) {
      setCount(prevCount => prevCount - 1)
      setFormData(prevData => ({ ...prevData, quantity: count - 1 }))
    } else {
      setCount(0)
      setFormData(prevData => ({ ...prevData, quantity: 0 }))
    }
  }

  const handleInputChange = (e: any, fieldName: any) => {
    const updatedFormData = { ...formData, [fieldName]: e.target.value }
    setFormData(updatedFormData)
  }
  const handleSelectChange = (value: any, fieldName: any) => {
    const updatedFormData = { ...formData, [fieldName]: value }
    setFormData(updatedFormData)
  }

  function submitAssemblyDetails() {
    localStorage.setItem('assemblyDetails', JSON.stringify(formData))
    Router.push('/checkoutPage')
  }

  return (
    <>
      <ChakraProvider theme={theme}>
        <Box
          p={'20px'}
          pt={'30px'}
        >
          <FormControl variant="floating">
            <Select
              onChange={e => handleSelectChange(e.target.value, 'type')}
              value={formData.type}
              // placeholder="Select option"
              border={'unset'}
              borderRadius="unset"
              borderBottom={'1px solid'}
              paddingBottom={'2px'}
              _focusVisible={{
                borderColor: 'unset',
                boxShadow: 'unset'
              }}
              css={{
                '& option': {
                  fontSize: '14px'
                }
              }}
            >
              <option
                value=""
                disabled
                hidden
              >
                Select Type
              </option>
              <option value="Plastic Box">Plastic Box</option>
              <option value="Wooden Box">Wooden Box</option>
            </Select>

            <FormLabel className="dropDown_label">Type</FormLabel>
          </FormControl>
          <Flex
            mt={'40px'}
            justifyContent="space-between"
            alignItems={'center'}
          >
            <FormControl
              variant="floating"
              w={'45%'}
            >
              <Select
                onChange={e => handleSelectChange(e.target.value, 'colour')}
                value={formData.colour}
                border={'unset'}
                borderRadius="unset"
                borderBottom={'1px solid'}
                paddingBottom={'2px'}
                _focusVisible={{
                  borderColor: 'unset',
                  boxShadow: 'unset'
                }}
                css={{
                  '& option': {
                    fontSize: '14px'
                  }
                }}
              >
                <option
                  value=""
                  disabled
                  hidden
                >
                  Select Color
                </option>
                <option value="Blue">Blue</option>
                <option value="Red">Red</option>
                <option value="Green">Green</option>
              </Select>

              <FormLabel className="dropDown_label">Color</FormLabel>
            </FormControl>
            <FormControl
              variant="floating"
              w={'45%'}
            >
              <Select
                onChange={e => handleSelectChange(e.target.value, 'shape')}
                value={formData.shape}
                border={'unset'}
                borderRadius="unset"
                borderBottom={'1px solid'}
                paddingBottom={'2px'}
                _focusVisible={{
                  borderColor: 'unset',
                  boxShadow: 'unset'
                }}
                css={{
                  '& option': {
                    fontSize: '14px'
                  }
                }}
              >
                <option
                  value=""
                  disabled
                  hidden
                >
                  Select Shape
                </option>
                <option value="Cirlce">Circle</option> circle
                <option value="Square">Square</option>
              </Select>

              <FormLabel className="dropDown_label">Shape</FormLabel>
            </FormControl>
          </Flex>
          <Flex
            mt={'40px'}
            justifyContent="space-between"
            alignItems={'center'}
          >
            <FormControl
              variant="floating"
              w={'45%'}
            >
              <Input
                onChange={e => handleInputChange(e, 'length')}
                border={'unset'}
                borderRadius="unset"
                borderBottom={'1px solid'}
                paddingBottom={'2px'}
                height="unset"
                fontSize={'15px'}
                paddingInlineEnd="unset"
                paddingInlineStart="unset"
                _focusVisible={{
                  borderColor: 'unset',
                  boxShadow: 'unset'
                }}
                placeholder=" "
                value={formData.length}
              />
              <FormLabel className="dropDown_label">Length (in mm)</FormLabel>
            </FormControl>
            <FormControl
              variant="floating"
              w={'45%'}
            >
              <Input
                onChange={e => handleInputChange(e, 'width')}
                border={'unset'}
                borderRadius="unset"
                borderBottom={'1px solid'}
                paddingBottom={'2px'}
                height="unset"
                fontSize={'15px'}
                paddingInlineStart="unset"
                paddingInlineEnd="unset"
                _focusVisible={{
                  borderColor: 'unset',
                  boxShadow: 'unset'
                }}
                placeholder=""
                value={formData.width}
              />

              <FormLabel className="dropDown_label">Width (in mm)</FormLabel>
            </FormControl>
          </Flex>
          <Flex
            mt={'40px'}
            justifyContent="space-between"
            alignItems={'center'}
          >
            <FormControl
              variant="floating"
              w={'45%'}
            >
              <Flex
                justifyContent={'space-between'}
                alignItems="center"
              >
                <Box
                  position={'absolute'}
                  left="0"
                  fontSize={'22px'}
                  zIndex="99"
                  onClick={decrement}
                >
                  -
                </Box>
                <Input
                  border={'unset'}
                  borderRadius="unset"
                  borderBottom={'1px solid'}
                  paddingBottom={'2px'}
                  height="unset"
                  fontSize={'15px'}
                  paddingInlineEnd="unset"
                  paddingInlineStart="unset"
                  _focusVisible={{
                    borderColor: 'unset',
                    boxShadow: 'unset'
                  }}
                  placeholder="100"
                  value={count}
                  type={'number'}
                  textAlign="center"
                  isReadOnly
                />
                <Box
                  position={'absolute'}
                  right="0"
                  fontSize={'20px'}
                  zIndex="99"
                  onClick={increment}
                >
                  +
                </Box>
              </Flex>
              <FormLabel
                className="dropDown_label"
                transform="scale(1) translateY(-24px)"
              >
                Quantity
              </FormLabel>
            </FormControl>
            <FormControl
              variant="floating"
              w={'45%'}
            >
              <Input
                onChange={e => handleInputChange(e, 'weight')}
                border={'unset'}
                borderRadius="unset"
                borderBottom={'1px solid'}
                paddingBottom={'2px'}
                height="unset"
                fontSize={'15px'}
                paddingInlineEnd="unset"
                paddingInlineStart="unset"
                _focusVisible={{
                  borderColor: 'unset',
                  boxShadow: 'unset'
                }}
                placeholder=" "
                type={'text'}
                value={formData.weight}
              />

              <FormLabel className="dropDown_label">Weight (in Kg)</FormLabel>
            </FormControl>
          </Flex>
        </Box>
      </ChakraProvider>
      <Button
        className="assembly_details_btn"
        text="Add Shipping Details"
        handleClick={submitAssemblyDetails}
      />
    </>
  )
}
