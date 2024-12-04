import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Order from './pages/Order/Order';
import MyOrder from './pages/Myorders/MyOrder';
import TrackOrder from './pages/TrackOrder/TrackOrder';
import Home from './pages/Home/Home';
import Payment from './pages/Payment/Payment';
import AddProfileDetails from './pages/AddProfile/AddProfileDetails';
import EditProfile from './pages/EditProfile/EditProfile';
import Support from './pages/Support/Support';
import AdminLogin from './pages/Login/AdminLogin';
import AdminSignUp from './pages/SignUp/AdminSignUp';
import AdminDashboard from './pages/Home/AdminDashboard';
import AdminProfile from './pages/AdminPages/AdminProfile';
import AdminOrders from './pages/AdminPages/AdminOrders';
import AdminPayments from './pages/AdminPages/AdminPayments';
import ForgetPassword from './pages/ForgetPassword/ForgetPassword';
import VerifyCode  from './pages/ForgetPassword/VerifyCode';
import ResetPassword from './pages/ForgetPassword/ResetPassword';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path='/forgot-password' element={<ForgetPassword/>}/>
        <Route path='/verify-otp' element={<VerifyCode/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path="/addprofile" element={<AddProfileDetails/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/editprofile" element={<EditProfile/>}/>
        <Route path='/order' element={<Order/>}/>
        <Route path='/myorder' element={<MyOrder/>}/>
        <Route path='/trackorder/:trackingId' element={<TrackOrder/>}/>
        <Route path='/makepayment/:orderId' element={<Payment/>}/>
        <Route path='/support' element={<Support/>}/>
        <Route path='/admin/signup' element={<AdminSignUp/>}/>
        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
        <Route path='/admin/profile' element={<AdminProfile/>}/>
        <Route path='/admin/orders' element={<AdminOrders/>}/>
        <Route path='/admin/payments' element={<AdminPayments/>}/>
      </Routes>
    </Router>
  );
}

export default App;