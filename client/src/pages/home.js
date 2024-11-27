import { useContext, useEffect } from 'react'
import { TransactionContext } from '../context/TransactionContext'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/nav'

const Home = () => {
	const { currentAccount, loadUserList, userVReqList, getVerifierName } = useContext(TransactionContext)
	const navigate = useNavigate()

  useEffect(() => {
      loadUserList();
  },[])



    // useEffect(() => {
    //   if (currentAccount != "") {
    //   getVerifierName(currentAccount.toLowerCase()).then((name) => {
    //       if (name !== "") 
    //         navigate('/admin')
    //       else 
    //         navigate('/home')
    //     });
    //   }
    // }, [currentAccount]);
    
    useEffect(() => {
      const checkAdminStatus = async () => {
        if (currentAccount) {
          const name = await getVerifierName(currentAccount);
          if (name !== "") {
            navigate('/admin');
          } else {
            navigate('/home');
          }
        }
      };
    
      checkAdminStatus();
    }, [currentAccount, navigate]);

	return (
		<div className='w-full h-full overflow-x-hidden bg-cover bg-center' style={{ backgroundImage: "url('/bg3.jpg')" }}>
      <Nav />

			<div className='flex flex-col items-center w-full h-full'>
				<h1 className='text-3xl font-bold m-7'>My Request Status</h1>

				<table class='w-2/4 rounded-lg border-2 border-gray'>
					<thead class='bg-blue-300'>
						<tr>
							<th scope='col' class='text-sm font-medium px-6 py-4 text-left'>
								Id
							</th>
							<th scope='col' class='text-sm font-medium px-6 py-4 text-left'>
								Verifier
							</th>
							<th scope='col' class='text-sm font-medium px-6 py-4 text-left'>
								Status
							</th>
						</tr>
					</thead>

					<tbody>
              {userVReqList.map(({ verifier, status }, index) => (
                <tr class='bg-gray-100 border-b' key={index}>
                  <td class='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {index}
                  </td>
                  <td class='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                    {verifier}
                  </td>
                  <td class='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                    {status === 0 && "PROCESSING"}
                    {status === 1 && "ACCEPTED"}
                    {status === -1 && "REJECTED"} 
                  </td>				   
                </tr>
              ))}
					</tbody>
				</table>
			</div>
    </div>
	)
}

export default Home
