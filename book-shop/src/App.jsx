import React from "react"
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import { CartProvider } from "./CartContext"
import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "./components/Navbar"
import ProductListing from "./pages/ProductListing"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import AdminPanel from "./pages/AdminPanel"
import Orders from "./pages/Orders"

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [role, setRole] = useState("")
	const [books, setBooks] = useState([])
	const [categories, setCategories] = useState([])
	const [cartItems, setCartItems] = useState([])
	const [roleLoaded, setRoleLoaded] = useState(false)

	useEffect(() => {
		if (localStorage.getItem("token")) {
			setIsLoggedIn(true)
			const token = localStorage.getItem("token")

			try {
				const decodedToken = JSON.parse(atob(token.split(".")[1]))
				setRole(decodedToken.role)
			} catch (error) {
				console.error("Invalid token format:", error)
				setIsLoggedIn(false)
				setRole("")
				localStorage.removeItem("token")
			}
		}
		setRoleLoaded(true)
	}, [])

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const endpoint =
					role === "ROLE_ADMIN"
						? "https://springboot-e-commerce-project-sab4.onrender.com/book/admin/get-all-book"
						: "https://springboot-e-commerce-project-sab4.onrender.com/book/get-all-book"

				const response = await axios.get(endpoint, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`
					}
				})

				const data = response.data
				setBooks(data)

				const uniqueCategories = [...new Set(data.map((book) => book.category))]
				setCategories(uniqueCategories)
			} catch (error) {
				console.error("Error fetching books:", error)
			}
		}

		if (roleLoaded) {
			fetchBooks()
		}
	}, [role, roleLoaded])

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const endpoint =
					role === "ROLE_ADMIN"
						? "https://springboot-e-commerce-project-sab4.onrender.com/book/admin/get-all-book"
						: "https://springboot-e-commerce-project-sab4.onrender.com/book/get-all-book"

				const response = await axios.get(endpoint, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`
					}
				})

				const data = response.data
				setBooks(data)

				const uniqueCategories = [...new Set(data.map((book) => book.category))]
				setCategories(uniqueCategories)
			} catch (error) {
				console.error("Error fetching books:", error)
			}
		}

		fetchBooks()
	}, [role])

	useEffect(() => {
		const fetchCart = async () => {
			try {
				const response = await axios.get("https://springboot-e-commerce-project-sab4.onrender.com/cart/get", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`
					}
				})

				const data = response.data
				const books = data.map((item) => ({
					isbn: item.book.isbn,
					name: item.book.name,
					price: item.book.price,
					image: item.book.image,
					quantity: item.quantity
				}))

				setCartItems(books)
			} catch (error) {
				console.error("Error fetching cart:", error)
			}
		}

		fetchCart()
	}, [])

	return (
		<CartProvider isLoggedIn={isLoggedIn} cartItems={cartItems} setCartItems={setCartItems}>
			<Router>
				<Navbar isLoggedIn={isLoggedIn} role={role} />
				<Routes>
					<Route path="/" element={<ProductListing books={books} categories={categories} />} />
					<Route path="/products/:id" element={<ProductDetail books={books} />} />
					<Route path="/cart" element={<Cart />} />
					<Route path="/checkout" element={<Checkout />} />
					<Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} />
					<Route path="/profile" element={<Profile setIsLoggedIn={setIsLoggedIn} setRole={setRole} />}></Route>
					<Route path="/admin" element={<AdminPanel />} />
					<Route path="/orders" element={<Orders role={role} />} />
				</Routes>
			</Router>
		</CartProvider>
	)
}

export default App
