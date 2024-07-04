import { useTheme } from '@chakra-ui/react'

const CustomFilterIconComponent = () => {
  const theme = useTheme()

  const primaryColor = theme.colors.primary['100']
  const strokeColor = '#fff'

  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className="filter-svg-style"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="47"
        height="47"
        rx="11.5"
        fill={primaryColor}
      />
      <rect
        x="0.5"
        y="0.5"
        width="47"
        height="47"
        rx="11.5"
        stroke={primaryColor}
      />
      <path
        d="M15.75 19.5C16.5784 19.5 17.25 18.8284 17.25 18C17.25 17.1716 16.5784 16.5 15.75 16.5C14.9216 16.5 14.25 17.1716 14.25 18C14.25 18.8284 14.9216 19.5 15.75 19.5Z"
        stroke={strokeColor}
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
      <path
        d="M17.25 18H36"
        stroke={strokeColor}
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
      <path
        d="M15.75 31.5C16.5784 31.5 17.25 30.8284 17.25 30C17.25 29.1716 16.5784 28.5 15.75 28.5C14.9216 28.5 14.25 29.1716 14.25 30C14.25 30.8284 14.9216 31.5 15.75 31.5Z"
        stroke={strokeColor}
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
      <path
        d="M17.25 30H36"
        stroke={strokeColor}
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
      <path
        d="M32.25 25.5C33.0784 25.5 33.75 24.8284 33.75 24C33.75 23.1716 33.0784 22.5 32.25 22.5C31.4216 22.5 30.75 23.1716 30.75 24C30.75 24.8284 31.4216 25.5 32.25 25.5Z"
        stroke={strokeColor}
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
      <path
        d="M30.75 24H12"
        stroke={strokeColor}
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
      <path
        d="M14.25 18H12"
        stroke={strokeColor}
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
      <path
        d="M33.75 24H36"
        stroke={strokeColor}
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
      <path
        d="M14.25 30H12"
        stroke={strokeColor}
        stroke-miterlimit="10"
        stroke-linejoin="round"
      />
    </svg>
  )
}
export default CustomFilterIconComponent
