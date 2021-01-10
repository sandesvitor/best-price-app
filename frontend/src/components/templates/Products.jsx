import React, { useState, useEffect } from 'react';
import './Products.css';
import axios from 'axios'
import { Spinner, Pagination } from 'react-bootstrap'

import Product from './Product'

export default function Products(props) {
    const baseUrl = props.baseUrl

    const [loaded, setLoaded] = useState(false)
    const [productsData, setProductsData] = useState({})
    const [manufactures, setManufacturers] = useState(null)

    const [page, setPage] = useState(1)
    const [rating, setRating] = useState(5)
    const [maxPrice, setMaxPrice] = useState(0)
    const [range, setRange] = useState(0)


    const [queryString, setQueryString] = useState('')



    const renderProduct = () => {
        if (productsData.results !== null) {
            return productsData.results.map((product, index) => {
                return (
                    <Product key={index}
                        title={product.name}
                        price={product.price}
                        stars={product.stars}
                        retailer={product.retailer}
                        imageUrl={product.imageUrl}
                        link={product.link}
                    />
                )
            })
        }
    }

    const renderManufacturersCheckboxes = () => {
        if (manufactures !== null) {
            return manufactures.map((manufacturer, index) => {
                return (
                    <span key={index}>
                        <input type="checkbox"
                            name={manufacturer}
                            value={manufacturer}
                        /> {manufacturer}
                    </span>
                )
            })
        }
    }

    useEffect(() => {

        const fetchInicialProducts = async () => {
            setLoaded(false)
            const price = await axios(`${baseUrl}/meta/max`)
            const allManufacturers = await axios(`${baseUrl}/meta/man`)
            const initProducts = await axios(`${baseUrl}?mp=3500&sr=4&pl=30&pg=2`)

            setMaxPrice(price.data + 1)
            setManufacturers(allManufacturers.data)
            setProductsData(initProducts.data)
            setLoaded(true)
        }

        fetchInicialProducts()

    }, [])

    useEffect(() => {
        console.info(queryString)
        console.info(productsData)
        const fetchFilteredProducts = async () => {
            const filteredProducts = await axios(`${baseUrl}${queryString}`)
            setProductsData(filteredProducts.data)
        }

        fetchFilteredProducts()
    }, [queryString])

    function handleSelectedStars(value) {
        const stars = document.querySelectorAll('.price-rating .stars')
        stars.forEach(star => {
            if (star.getAttribute("value") === value) {
                star.classList.add('selected')
            } else {
                star.classList.remove('selected')
            }

        })

        setRating(parseInt(value))
    }

    return (
        <section className="products">

            <div className="sidebar-container">
                <aside className="sidebar">

                    <div className="category">
                        <h1>{props.sidebarTitle}</h1>
                    </div>
                    <hr />
                    <div className="price-range">
                        <h2>Limite de Preço</h2>
                        R${
                            range
                                .toString()
                                .replace('.', ',')
                                .replace(/[0-9](?=(?:[0-9]{3})+(?![0-9]))/g, '$&.')
                        }
                        <input
                            type="range"
                            min="0" max={maxPrice}
                            value={range}
                            onChange={e => {
                                setRange(parseFloat(e.target.value).toFixed(2))
                            }}
                            step="1"
                        />
                    </div>
                    <div className="price-rating">
                        <h2>Rating do Produto</h2>
                        <div className="stars"
                            value="1"
                            onClick={() => handleSelectedStars("1")}>
                            <i className="fas fa-star"></i>
                            <i className="far fa-star"></i>
                            <i className="far fa-star"></i>
                            <i className="far fa-star"></i>
                            <i className="far fa-star"></i>
                        </div>
                        <div className="stars"
                            value="2"
                            onClick={() => handleSelectedStars("2")}>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="far fa-star"></i>
                            <i className="far fa-star"></i>
                            <i className="far fa-star"></i>
                        </div>
                        <div className="stars"
                            value="3"
                            onClick={() => handleSelectedStars("3")}>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="far fa-star"></i>
                            <i className="far fa-star"></i>
                        </div>
                        <div className="stars"
                            value="4"
                            onClick={() => handleSelectedStars("4")}>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="far fa-star"></i>
                        </div>
                        <div className="stars"
                            value="5"
                            onClick={e => handleSelectedStars("5")}>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                        </div>
                    </div>
                    <div className="order-by-price">
                        <h2>Ordenar por preço:</h2>
                        <select name="prices">
                            <option value="desc">Descrescente</option>
                            <option value="asc">Crescente</option>
                        </select>
                    </div>
                    <div className="products-per-page">
                        <h2>Produtos por Página:</h2>
                        <select name="productsInPage">
                            <option value="15">15</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div className="manufacturers">
                        <h2>Fabricantes</h2>
                        {renderManufacturersCheckboxes()}
                    </div>
                    <div className="sidebar-btn"
                        onClick={e => {
                            let m = Array.from(document.querySelectorAll('.manufacturers input'))
                            let mChecked = m.filter(f => f.checked === true).map(m => m.value)
                            let mChumk = ''
                            mChecked.forEach(e => {
                                mChumk += `&mn=${e}`
                            })
                            let qRange = parseInt(range) === 0 ? '' : `&mp=${parseInt(range)}`

                            let selectedValueOrderByPrice = document.querySelector('.order-by-price select').value
                            let qOrderByPrice = selectedValueOrderByPrice === 'desc' ? `&ob_p=0` : `&ob_p=1`

                            let selectedValueProducsPerPage = document.querySelector('.products-per-page select').value
                            let qProductsPerPage = `pl=${selectedValueProducsPerPage}`

                            let qRating = `&sr=${rating}`

                            // IMPLEMENTAR MAIS ESSES DOIS FILTROS >>>
                            // let qRetailer = `&rt=(...)` ---> precisa aplicar array!!! 

                            let query = `?${qProductsPerPage}`
                                + qRange
                                + mChumk
                                + qOrderByPrice
                                + qRating

                            setQueryString(query)
                        }}>
                        Aplicar Filtros
                    </div>


                </aside>
            </div>

            <div className="products-container">
                {loaded
                    ? renderProduct()
                    : <Spinner className="loading-spinner" animation="border" variant="danger" />
                }
                <Pagination>
                    <Pagination.First />
                    <Pagination.Prev />
                    <Pagination.Item>{1}</Pagination.Item>
                    <Pagination.Ellipsis />

                    <Pagination.Item>{10}</Pagination.Item>
                    <Pagination.Item>{11}</Pagination.Item>
                    <Pagination.Item>{12}</Pagination.Item>
                    <Pagination.Item active>{13}</Pagination.Item>
                    <Pagination.Item disabled>{14}</Pagination.Item>

                    <Pagination.Ellipsis />
                    <Pagination.Item>{20}</Pagination.Item>
                    <Pagination.Next />
                    <Pagination.Last />
                </Pagination>
            </div>

        </section>
    )
}