'use client'
import { useState } from 'react'

export default function DemoForms() {
    const [month, setMonth] = useState('')
    const [revenue, setRevenue] = useState('')

    const submitData = async () => {
        let response = await fetch(process.env.BACKEND_URL+`/api/revenues`, {
            method: 'POST',
            body: JSON.stringify({
                'data': {
                    month: month,
                    revenue: revenue
                }
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })

        response = await response.json()

        alert(JSON.stringify(response))
    }

    return (
        <>
            <h2>Post API Request</h2>
            <input
                type='text'
                value={month}
                onChange={e => setMonth(e.target.value)}
                placeholder='Enter Month'
            />

            <input
                type='text'
                value={revenue}
                onChange={e => setRevenue(e.target.value)}
                placeholder='Enter Revenue'
            />
            <button onClick={submitData}>Submit</button>
        </>
    )
}