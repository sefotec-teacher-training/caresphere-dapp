import React, { useState, useEffect } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import MedicalRecordsABI from './MedicalRecordABI.json' 

const contractAddress = '0x9DF0adb6b1b63f60409be70F38c4102cA58f8734';

const App = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [doctorToApprove, setDoctorToApprove] = useState('');
  const [myRecord, setMyRecord] = useState(null);
  const [record, setRecord] = useState({
    patient: '',
    name: '',
    bloodType: '',
    diagnosis: '',
    treatment: ''
  });

  // Connect wallet function using modern pattern
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found. Please install MetaMask first.');
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      await initContract();
    } catch (err) {
      setError(`Wallet connection failed: ${err.message}`);
    }
  };

  // Initialize the contract with proper error handling
  const initContract = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found');
      }
      
      const browserProvider = new BrowserProvider(window.ethereum);
      setProvider(browserProvider);
      
      const signer = await browserProvider.getSigner();
      const contractInstance = new Contract(contractAddress, MedicalRecordsABI, signer);
      setContract(contractInstance);
      
      // Get current accounts
      const accounts = await browserProvider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0].address);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Contract initialization error:', err);
      setError(`Failed to initialize app: ${err.message}`);
      setLoading(false);
    }
  };

  // Setup event listeners for MetaMask
  useEffect(() => {
    const setupEvents = async () => {
      if (window.ethereum) {
        // Handle account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            setAccount(null);
            setContract(null);
          }
        });

        // Handle chain changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

        // Try to connect if previously connected
        try {
          await initContract();
        } catch (err) {
          setLoading(false);
          console.error(err);
        }
      } else {
        setError('MetaMask not found. Please install MetaMask first.');
        setLoading(false);
      }
    };

    setupEvents();

    // Cleanup event listeners on component unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const approveDoctor = async () => {
    if (!contract) return setError('Contract not loaded');
    if (!doctorToApprove) return setError('Please enter a doctor address');
    
    try {
      setLoading(true);
      const tx = await contract.approveDoctor(doctorToApprove);
      await tx.wait();
      alert('Doctor approved successfully!');
      setDoctorToApprove('');
    } catch (err) {
      console.error(err);
      setError(`Failed to approve doctor: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async () => {
    if (!contract) return setError('Contract not loaded');
    
    // Validate fields
    if (!record.patient || !record.name || !record.bloodType || !record.diagnosis || !record.treatment) {
      return setError('All fields are required');
    }
    
    try {
      setLoading(true);
      const tx = await contract.addOrUpdateRecord(
        record.patient,
        record.name,
        record.bloodType,
        record.diagnosis,
        record.treatment
      );
      await tx.wait();
      alert('Record added successfully!');
      
      // Clear form
      setRecord({
        patient: '',
        name: '',
        bloodType: '',
        diagnosis: '',
        treatment: ''
      });
    } catch (err) {
      console.error(err);
      setError(`Failed to add record: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getMyInfo = async () => {
    if (!contract) return setError('Contract not loaded');
    
    try {
      setLoading(true);
      const result = await contract.getMyRecord();
      setMyRecord({
        name: result[0],
        bloodType: result[1],
        diagnosis: result[2],
        treatment: result[3],
        doctor: result[4],
        timestamp: result[5]
      });
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error(err);
      if (err.message.includes('No record found')) {
        setError('No medical record found for your address.');
      } else {
        setError(`Failed to fetch record: ${err.message}`);
      }
      setMyRecord(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg p-6 space-y-6 max-w-4xl mx-auto rounded">
        <h1 className="text-2xl font-bold text-center">CARESPHERE - HEALTH Records</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {loading && (
          <div className="bg-blue-100 text-blue-600 p-3 rounded">
            <p>Processing transaction, please wait...</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm">
            {account ? (
              <span>Connected wallet: {account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
            ) : (
              'Wallet not connected'
            )}
          </span>
          <button
            onClick={connectWallet}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {account ? 'Connected' : 'Connect Wallet'}
          </button>
        </div>

        <hr />

        {/* Approve Doctor Section */}
        <section className="p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-lg mb-3">1. Approve Doctor (Admin Only)</h2>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="border-2 px-2 py-1 rounded w-full"
              placeholder="Doctor Address (0x...)"
              value={doctorToApprove}
              onChange={(e) => setDoctorToApprove(e.target.value)}
            />
            <button
              onClick={approveDoctor}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              disabled={!account || loading}
            >
              Approve
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">Only the contract owner can approve doctors.</p>
        </section>

        {/* Add Medical Record Section */}
        <section className="p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-lg mb-3">2. Add Medical Record (Doctors Only)</h2>
          <div className="flex flex-col gap-2 mt-2">
            <input
              type="text"
              placeholder="Patient Address (0x...)"
              className="border-2 px-2 py-1 rounded"
              value={record.patient}
              onChange={(e) => setRecord({ ...record, patient: e.target.value })}
            />
            <input
              type="text"
              placeholder="Patient Name"
              className="border-2 px-2 py-1 rounded"
              value={record.name}
              onChange={(e) => setRecord({ ...record, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Blood Type (e.g., A+, B-)"
              className="border-2 px-2 py-1 rounded"
              value={record.bloodType}
              onChange={(e) => setRecord({ ...record, bloodType: e.target.value })}
            />
            <input
              type="text"
              placeholder="Diagnosis"
              className="border-2 px-2 py-1 rounded"
              value={record.diagnosis}
              onChange={(e) => setRecord({ ...record, diagnosis: e.target.value })}
            />
            <input
              type="text"
              placeholder="Treatment"
              className="border-2 px-2 py-1 rounded"
              value={record.treatment}
              onChange={(e) => setRecord({ ...record, treatment: e.target.value })}
            />
          </div>
          <button
            onClick={addRecord}
            className="bg-blue-600 text-white px-4 py-1 mt-2 rounded hover:bg-blue-700"
            disabled={!account || loading}
          >
            Add Record
          </button>
          <p className="text-sm text-gray-500 mt-2">Only approved doctors can add or update records.</p>
        </section>

        {/* View My Record Section */}
        <section className="p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-lg mb-3">3. View My Record</h2>
          <button
            onClick={getMyInfo}
            className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
            disabled={!account || loading}
          >
            Load My Record
          </button>
          {myRecord && (
            <div className="mt-3 bg-white p-4 rounded border">
              <p><strong>Name:</strong> {myRecord.name}</p>
              <p><strong>Blood Type:</strong> {myRecord.bloodType}</p>
              <p><strong>Diagnosis:</strong> {myRecord.diagnosis}</p>
              <p><strong>Treatment:</strong> {myRecord.treatment}</p>
              <p><strong>Doctor:</strong> {myRecord.doctor}</p>
              <p><strong>Timestamp:</strong> {new Date(Number(myRecord.timestamp) * 1000).toLocaleString()}</p>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">You can only view your own medical record.</p>
        </section>
      </div>
    </div>
  );
};

export default App;