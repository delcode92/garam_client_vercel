import React, { useEffect, useState } from 'react'

function index() {

  const [message, setMessage] = useState("Loading")
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/get_data").then(
      response => response.json()
    ).then(
      data => {
      console.log(data);
      }
    )
  }, [])

  return (
    <div>
      hai hello
    </div>
  )
}

export default index