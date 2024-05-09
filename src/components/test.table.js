import React from 'react'

const Table = () => {
  return (
    <>
        <h2 className='font-bold mt-8 text-xl'>
            Recent Transactions
        </h2>
        <div className="overflow-x-auto rounded-lg mt-3">
            <table className="daisytable bg-white rounded-lg">
                {/* head */}
                <thead>
                    <tr>
                        <th>Icon</th>
                        <th>Transaction Name</th>
                        <th>Date</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {/* row 1 */}
                    <tr className='bg-pinkDashboard/60'>
                        <th>1</th>
                        <td>Cy Ganderton</td>
                        <td>Quality Control Specialist</td>
                        <td>Blue</td>
                    </tr>
                    {/* row 2 */}
                    <tr>
                        <th>2</th>
                        <td>Hart Hagerty</td>
                        <td>Desktop Support Technician</td>
                        <td>Purple</td>
                    </tr>
                    {/* row 3 */}
                    <tr>
                        <th>3</th>
                        <td>Brice Swyre</td>
                        <td>Tax Accountant</td>
                        <td>Red</td>
                    </tr>
                    {/* row 3 */}
                    <tr>
                        <th>4</th>
                        <td>Brice Swyre</td>
                        <td>Tax Accountant</td>
                        <td>Red</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
  )
}

export default Table