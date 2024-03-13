import React, { useEffect } from 'react'
import { categorySmContent } from '../../mock/category-sm'
import CategorySmBox from './CategorySmBox'
import { categoryLgContent } from '../../mock/category-lg'
import CategoryLgBox from './CategoryLgBox'
import { useLanguage } from '../../hooks/useLanguage'
import SectionTitle from '../UI/SectionTitle'
import { Spinner } from '@chakra-ui/react'

const Loading = () => {
    const { t } = useLanguage()

    return (
        <div className="h-[40vh] flex justify-center items-center">
            <div className="flex flex-col items-center gap-2">
                <Spinner
                    color="#A71B4A"
                    size="xl"
                />
                <h4 className="font-bold text-[16px] leading-[25px]">
                    {t['categoryLoadPrimary']}
                </h4>
                <p>{t['categoryLoadSecondary']}</p>
            </div>
        </div>
    )
}

const Category = () => {
    const [loading, setLoading] = React.useState(true)
    const { t } = useLanguage()

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

    if (loading) return <Loading />

    return (
        <div className="flex flex-col items-center my-4 md:my-8">
            <SectionTitle title="BrowseByCategory" />

            {/* 📱 sm and md break point */}
            <div className="flex flex-wrap justify-around items-center lg:hidden">
                {categorySmContent.map((categoryItem) => {
                    return (
                        <CategorySmBox
                            bgc={categoryItem.bgc}
                            imgSrc={categoryItem.imgSrc}
                            categoryTitle={categoryItem.categoryTitle}
                            href={categoryItem.href}
                            key={categoryItem.categoryTitle}
                        />
                    )
                })}
            </div>

            {/* 💻lg break point */}
            <div className="hidden lg:grid  gap-4 grid-rows-9 grid-cols-2 md:grid-cols-9 w-full xl:max-w-[2100px] mx-auto">
                {categoryLgContent.map(
                    ({
                        name,
                        title,
                        description,
                        styles,
                        href,
                        imgSrc,
                        imgWidth,
                        imgHeight,
                    }) => {
                        return (
                            <CategoryLgBox
                                key={name}
                                name={name}
                                title={title}
                                description={description}
                                styles={styles}
                                href={href}
                                imgSrc={imgSrc}
                                imgWidth={imgWidth}
                                imgHeight={imgHeight}
                            />
                        )
                    }
                )}
            </div>
        </div>
    )
}

export default Category
