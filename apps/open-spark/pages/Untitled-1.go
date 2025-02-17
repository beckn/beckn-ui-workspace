{
    "data": [
        {
            "context": {
                "transaction_id": "4e4ef552-2397-454d-b16c-2f44704279c8",
                "bpp_id": "bpp-ps-network-strapi2-dev.becknprotocol.io",
                "bpp_uri": "http://bpp-ps-network-strapi2-dev.becknprotocol.io",
                "domain": "deg:rental"
            },
            "message": {
                "orders": [
                    {
                        "provider": {
                            "id": "25"
                        },
                        "items": [
                            {
                                "id": "30",
                                "code": "150Ah Inverter Tubular Battery",
                                "name": "150Ah Inverter Tubular Battery",
                                "short_desc": "150Ah Inverter Tubular Battery",
                                "long_desc": "150Ah Inverter Tubular Battery",
                                "images": [
                                    {
                                        "url": "https://rukminim1.flixcart.com/image/300/300/k3orqfk0/inverter-battery/6/g/m/inverlast-iltt18000n-150ah-tall-tubular-battery-luminous-original-imafdcffhg83fpna.jpeg",
                                        "size_type": "sm"
                                    }
                                ],
                                "price": {
                                    "value": "100",
                                    "currency": "INR"
                                },
                                "rating": "4.5",
                                "rateable": true,
                                "quantity": {
                                    "available": {
                                        "count": 1000,
                                        "measure": {
                                            "value": "1000",
                                            "unit": "per hour"
                                        }
                                    }
                                },
                                "fulfillments": [
                                    {
                                        "id": "6",
                                        "type": "RENTAL_START",
                                        "state": {
                                            "code": "timestamp",
                                            "name": "1739601000"
                                        }
                                    },
                                    {
                                        "id": "7",
                                        "type": "RENTAL_END",
                                        "state": {
                                            "code": "timestamp",
                                            "name": "1740464999"
                                        }
                                    },
                                    {
                                        "id": "6",
                                        "type": "RENTAL_START",
                                        "state": {
                                            "code": "timestamp",
                                            "name": "1739601000"
                                        }
                                    },
                                    {
                                        "id": "7",
                                        "type": "RENTAL_END",
                                        "state": {
                                            "code": "timestamp",
                                            "name": "1740464999"
                                        }
                                    }
                                ]
                            }
                        ],
                              "stops": [
                                    {
                                        "location": {
                                            "gps": "12.898773,77.5764094",
                                            "address": "1202 b2, Bengaluru urban, Bengaluru, Karnataka",
                                            "city": {
                                                "name": "Bengaluru"
                                            },
                                            "state": {
                                                "name": "Karnataka"
                                            },
                                            "country": {
                                                "code": "IND"
                                            },
                                            "area_code": "560078"
                                        },
                                        "contact": {
                                            "phone": "9811259151",
                                            "email": "lisa.k@gmail.com"
                                        }
                                    }
                                ]
                        "fulfillments": [
                            {
                                "id": "6",
                                "type": "RENTAL_START",
                                "state": {
                                    "description": "1739601000",
                                    "descriptor": {
                                        "code": "timestamp",
                                        "name": "1739601000"
                                    }
                                },
                          
                            },
                            {
                                "id": "7",
                                "type": "RENTAL_END",
                                "state": {
                                    "description": "1740464999",
                                    "descriptor": {
                                        "code": "timestamp",
                                        "name": "1740464999"
                                    }
                                }
                            }
                        ],
                        "billing": {
                            "name": "Lisa",
                            "phone": "9811259151",
                            "address": "1202 b2, Bengaluru urban, Bengaluru, Karnataka",
                            "email": "lisa.k@gmail.com",
                            "city": {
                                "name": "Bengaluru"
                            },
                            "state": {
                                "name": "Karnataka"
                            }
                        },
                        "payments": [
                            {
                                "params": {
                                    "amount": "100",
                                    "currency": "INR"
                                },
                                "status": "PAID",
                                "type": "ON-FULFILLMENT"
                            }
                        ]
                    }
                ]
            }
        }
    ]
}