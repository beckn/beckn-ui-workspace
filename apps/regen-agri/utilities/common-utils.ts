export const toBinary = (objectString: string) => {
    const codeUnits = Uint16Array.from(
        { length: objectString.length },
        (element, index) => objectString.charCodeAt(index)
    )
    const charCodes = new Uint8Array(codeUnits.buffer)

    let result = ''
    charCodes.forEach((char) => {
        result += String.fromCharCode(char)
    })
    return result
}

export const fromBinary = (binary: string) => {
    const bytes = Uint8Array.from({ length: binary.length }, (element, index) =>
        binary.charCodeAt(index)
    )
    const charCodes = new Uint16Array(bytes.buffer)

    let result = ''
    charCodes.forEach((char) => {
        result += String.fromCharCode(char)
    })
    return result
}

export const areObjectPropertiesEqual = (obj1: any, obj2: any) => {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) {
        return false
    }

    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false
        }
    }

    return true
}

export function getUserLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser.'))
        } else {
            navigator.geolocation.getCurrentPosition(resolve, reject)
        }
    })
}
