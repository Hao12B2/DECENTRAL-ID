import React, { useContext, useEffect, useState } from "react";
import { TransactionContext } from "../context/TransactionContext";
import axios from "axios";
import Nav from "../components/nav";
import { pinataApiKey, pinataSecretApiKey } from "../utils/constants";

const AddDocument = () => {
	const initialState = {
		name: '',
		dob: '',
		mobile: 0,
		sex: '',
		college: '',
		email: '',
		verifier: '',
		cid: '',
	}
	const [formData, setFormData] = useState(initialState)
	const [application, setApplication] = useState('Select')
	const [document, setDocument] = useState('Select')
	const [isHash, setIsHash] = useState(0)

	const [fields, setFields] = useState([])
	const [selectedField, setSelectedField] = useState()
	const { submitDocument, getVerifierAddress } = useContext(TransactionContext)
	const [fieldValues, setFieldValues] = useState({});
	
	useEffect(() => {
		if (isHash === 1) {
			const { name, dob, mobile, sex, college, email, verifier, cid } = formData
			submitDocument(verifier,cid,name,sex,dob,parseInt(mobile),email,college);
		}
	}, [isHash])

	const getHash = (cid, verifier) => {
		if (!verifier || verifier === "Select") {
			return alert("Please select a verifier before submitting the document.");
		}
		
		try {
			getVerifierAddress(verifier).then(address => {
				setFormData(prev => ({ ...prev, cid, verifier: address }));
				setIsHash(1);
			});
		} catch (error) {
			console.log(error);
		}
	}

	const handleAddField = () => {
		if (selectedField && !fields.includes(selectedField)) {
			setFields([...fields, selectedField]); // Thêm trường vào mảng nếu chưa tồn tại
			setFieldValues(prev => ({ ...prev, [selectedField]: '' })); // Khởi tạo giá trị cho trường mới
			setSelectedField(''); // Reset selectedField
		} else {
			alert("This field has already been added or is not valid.");
		}
	}

	const handleFieldChange = (field, value) => {
		setFieldValues(prev => ({ ...prev, [field]: value })); // Cập nhật giá trị của trường
		setFormData(prev => ({ ...prev, [field]: value })); // Cập nhật formData
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		const form = e.target;

		if (!form || form.length === 0) {
			return alert('No files selected');
		}
		const doc = form[2].files[0];

		// Tạo một biến khác cho FormData để không trùng với formData trong state
		const fileFormData = new FormData();
		fileFormData.append("file", doc);

		// Gọi API Pinata để upload file lên IPFS
		try {
			const resFile = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", fileFormData, {
				headers: {
					"pinata_api_key": pinataApiKey,
					"pinata_secret_api_key": pinataSecretApiKey,
					"Content-Type": "multipart/form-data"
				},
			});

			const ipfsHash = resFile.data.IpfsHash;
			getHash(ipfsHash, formData.verifier); // formData ở đây là từ state

		} catch (error) {
			console.error("Error uploading file to Pinata: ", error);
			alert("Unable to upload file to Pinata");
		}
	}



	
	const documentMap = {
		Select: [],
		'Student Status': ['Student ID Card'],
		'Identity Proof': [
			'Driving License',
			'Citizen Identification',
		],
		'Educational Certificates': [
			'TOEIC',
			'TOEFL',
			'MOS',
		],
	}

	const verifierMap = {
		Select: [],
		'Student ID Card': ['SAO'],
		'Driving License': ['MTO'],
		'Citizen Identification': ['BCA_C06'],
		'TOEIC': ['IIG'],
		'TOEFL': ['IIG'],
		'MOS': ['IIG'],
	}

	const fieldDisplayNames = {
		name: "Name",
		dob: "Date of Birth",
		mobile: "Mobile",
		sex: "Gender",
		college: "College Name",
		email: "Email",
	};

	return (
		<div className='w-full h-full overflow-x-hidden bg-cover bg-center' style={{ backgroundImage: "url('/bg3.jpg')" }}>
			<Nav />
			<div className='flex flex-col items-center w-full pb-20 '>
			<div className='bg-gray-300 bg-opacity-70 p-10 rounded-lg w-[60%]'>
				<h1 className='text-3xl font-bold m-7 text-center'>Add Verification Request</h1>

				<form
					className='flex flex-col items-center w-full'
					onSubmit={handleSubmit}
				>
					<div className='w-[60%] my-3'>
						<label>Application</label>
						<select
							class='block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
							placeholder='application'
							onChange={(e) => setApplication(e.target.value)}
						>
							<option>Select</option>
							<option>Student Status</option>
							<option>Identity Proof</option>
							<option>Educational Certificates</option>
						</select>
					</div>

					<div className='w-[60%] my-3'>
						<label>Type of Document</label>
						<select
							class='block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
							placeholder='type of document'
							onChange={(e) => setDocument(e.target.value)}
						>
							<option>Select</option>
							{documentMap[application].map((val) => (
								<option>{val}</option>
							))}
						</select>
					</div>
					<div className='w-[60%] my-3'>
						<label>Document</label>
						<input
							class='appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
							id='grid-first-name'
							type='file'
							placeholder='Jane'
							name='doc'
						/>
					</div>
					<div className='w-[60%] my-3'>
						<label>Verifier</label>
						<select
							class='block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
							placeholder='type of document'
							name="verifier"
							onChange={(e)=>{
								setFormData((prev)=>{
									return {...prev,verifier:e.target.value}
								})
							}}
						>
							<option>Select</option>
							{verifierMap[document].map((val) => (
								<option value={val}>{val}</option>
							))}
						</select>
					</div>
					{/* Hiển thị các trường đã thêm */}
					<div>
						{fields.map((field, index) => (
							<div key={index} className='my-2'>
								<label>{fieldDisplayNames[field]}</label>
								{field === "sex" ? (
									<select
										value={fieldValues[field] || ''}
										onChange={(e) => handleFieldChange(field, e.target.value)} // Cập nhật giá trị của trường
										className='appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
									>
										<option defaultChecked hidden>Select</option>
										<option value='Male'>Male</option>
										<option value='Female'>Female</option>
										<option value='Other'>Other</option>
									</select>
								) : (
									<input
										type={field === "dob" ? "date" : "text"}
										placeholder={field} // Hiển thị tên trường như placeholder
										value={fieldValues[field] || ''}
										onChange={(e) => handleFieldChange(field, e.target.value)} // Cập nhật giá trị của trường
										className='appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
									/>
								)}
							</div>
						))}
					</div>
					{/* ADD FIELDS */}
					<div className='w-[60%] my-3'>
						<label>Add Fields</label>
						<div className='flex w-full'>
							<select
								className='block appearance-none w-1/2 bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
								value={selectedField}
								onChange={(e) => setSelectedField(e.target.value)}
							>
							<option value="">Select</option>
							<option value="name">Name</option>
							<option value="dob">Date of Birth</option>
							<option value="sex">Gender</option>
							<option value="mobile">Mobile</option>
							<option value="email">Email</option>
							<option value="college">College Name</option>
						</select>
						<button
							onClick={(e) => {
								e.preventDefault();
								handleAddField(); // Gọi hàm để thêm trường
							}}
							className='h-[44px] ml-6 w-1/2 flex justify-center items-center bg-blue-300 rounded'>
							Add Field +
						</button>
					</div>
				</div>
				
				<div className='w-[60%] my-3 flex'>
					<button
						type='submit'
						className='w-full h-[44px] bg-blue-300 flex justify-center items-center rounded font-semibold'
					>
						Add Document
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='25'
							height='25'
							viewBox='0 0 24 24'
						>
							<path
								fill='none'
								stroke='currentColor'
								stroke-width='2'
								d='M6 12.4h12M12.6 7l5.4 5.4l-5.4 5.4'
							/>
						</svg>
					</button>
				</div>
			</form>
		</div>
		</div>
	 </div>
	)
}

export default AddDocument
