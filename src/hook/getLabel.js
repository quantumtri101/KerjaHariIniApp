import useFetch from "./useFetch"
import React, { useEffect, useState } from 'react'


const cityLabel = (id) => {
  console.log('cityLabelID', id)
  const {data, isLoading} = useFetch('GET', '/city/all', {})
  const city = data.filter(e => e.id == id)
  console.log('cityLabel', city)
  return (city.id)
}

export default (cityLabel)