document.addEventListener('DOMContentLoaded', function () {
	// Upper Body Padding Function Navbar Height
	const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0
	document.body.style.paddingTop = navbarHeight + 'px'

	// Navbar Toggler Button Behavior
	const navbarToggler = document.querySelector('.navbar-toggler')
	if (navbarToggler) {
		navbarToggler.addEventListener('click', function () {
			if (navbarToggler.getAttribute('aria-expanded') === 'true') {
				navbarToggler.style.boxShadow = 'none'
			}
		})

		navbarToggler.addEventListener('focusout', function () {
			if (navbarToggler.getAttribute('aria-expanded') === 'false') {
				navbarToggler.style.boxShadow = ''
			}
		})
	}

	// Navbar Dropdown Menu Behavior
	const dropdownLinks = document.querySelectorAll(
		'.navbar-nav .dropdown-menu .dropdown-item'
	)
	const offCanvasMenu = document.querySelector('#navbarNavDropdown')

	dropdownLinks.forEach((link) => {
		link.addEventListener('click', (e) => {
			// Delay the collapse of the dropdown
			setTimeout(() => {
				const bootstrapCollapse = new bootstrap.Collapse(offCanvasMenu, {
					toggle: false,
				})
				bootstrapCollapse.hide()
			}, 300) // Adjust the delay time as needed
		})
	})

	// Navbar Off-Canvas Menu Collapse on Outside Click
	document.addEventListener('click', function (e) {
		if (
			!navbarToggler.contains(e.target) &&
			!offCanvasMenu.contains(e.target)
		) {
			const bootstrapCollapse = new bootstrap.Collapse(offCanvasMenu, {
				toggle: false,
			})
			bootstrapCollapse.hide()
		}
	})

	// Dropdown-items Active on Click
	const dropdownItems = document.querySelectorAll('.dropdown-item')
	const sections = document.querySelectorAll('section')

	const clearActiveClasses = () => {
		dropdownItems.forEach((item) => item.classList.remove('active'))
		document
			.querySelector('.nav-link.dropdown-toggle')
			.classList.remove('active')
	}

	const setActiveLink = (id) => {
		clearActiveClasses()
		const activeItem = document.querySelector(`a[href="services.html#${id}"]`)
		if (activeItem) {
			activeItem.classList.add('active')
			document
				.querySelector('.nav-link.dropdown-toggle')
				.classList.add('active')
		}
	}

	dropdownItems.forEach((item) => {
		item.addEventListener('click', function () {
			const targetId = this.getAttribute('href').split('#')[1]
			setActiveLink(targetId)
		})
	})

	// Dropdown-items Active on Scroll
	const handleScroll = () => {
		let currentSection = ''
		sections.forEach((section) => {
			const sectionTop = section.offsetTop - 100
			if (window.scrollY >= sectionTop) {
				currentSection = section.getAttribute('id')
			}
		})

		if (currentSection) {
			setActiveLink(currentSection)
		}
	}

	window.addEventListener('scroll', handleScroll)

	// Form Validation Code
	;(() => {
		'use strict'

		const forms = document.querySelectorAll('.needs-validation')

		Array.from(forms).forEach((form) => {
			form.addEventListener(
				'submit',
				(event) => {
					if (!form.checkValidity()) {
						event.preventDefault()
						event.stopPropagation()
					}

					form.classList.add('was-validated')
				},
				false
			)
		})
	})()

	// Form Submission Code
	const form = document.getElementById('contactForm')
	const submitButton = document.getElementById('submitButton')
	const spinner = document.getElementById('spinner')

	if (form) {
		form.addEventListener('submit', function (event) {
			event.preventDefault()

			if (!form.checkValidity()) {
				form.classList.add('was-validated')
				return
			}

			const formData = new FormData(form)
			const data = {}
			formData.forEach((value, key) => {
				data[key] = value
			})

			submitButton.style.display = 'none'
			spinner.style.display = 'inline-block'

			fetch('/send-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})
				.then((response) => {
					if (response.ok) {
						window.location.href = '/thanks.html'
					} else {
						console.error('Error:', response.statusText)
						submitButton.style.display = 'inline-block'
						spinner.style.display = 'none'
					}
				})
				.catch((error) => {
					console.error('Error:', error)
					submitButton.style.display = 'inline-block'
					spinner.style.display = 'none'
				})
		})
	}
})
