'use strict';

document.addEventListener("DOMContentLoaded", function() {

	//----------------------SLIDER-hero----------------------
		// var mySwiper = new Swiper('.hero__slider', {
		// 	slidesPerView: 1,
		// 	spaceBetween: 30,
		// 	loop: true,
		// 	effect: 'fade',
		// 	autoplay: {
		// 		delay: 5000,
		// 	},
		// 	pagination: {
		// 		el: '.hero__pagination',
		// 		clickable: 'true',
		// 	},
		// 	navigation: {
		// 		nextEl: '.hero__next',
		// 		prevEl: '.hero__prev',
		// 	},
		// 	breakpoints: {
		// 		320: {
		// 			slidesPerView: 2,
		// 			spaceBetween: 20
		// 		},
		// 	}
		// });

	//----------------------SCROLL-----------------------
		const scrollTo = (scrollTo) => {
			let list = document.querySelector(scrollTo);
			list = '.' + list.classList[0]  + ' li a[href^="#"';
	
			document.querySelectorAll(list).forEach(link => {
	
				link.addEventListener('click', function(e) {
						e.preventDefault();
						const scrollMenu = document.querySelector(scrollTo);
	
						let href = this.getAttribute('href').substring(1);
	
						const scrollTarget = document.getElementById(href);
	
						// const topOffset = scrollMenu.offsetHeight;
						const topOffset = 70;
						const elementPosition = scrollTarget.getBoundingClientRect().top;
						const offsetPosition = elementPosition - topOffset;
	
						window.scrollBy({
								top: offsetPosition,
								behavior: 'smooth'
						});
	
						
						let button = document.querySelector('.hamburger'),
								nav = document.querySelector('.header__nav'),
								header = document.querySelector('.header');
	
						button.classList.remove('hamburger--active');
						nav.classList.remove('header__nav--active');
						header.classList.remove('header--menu');
				});
			});
		};
		// scrollTo('.header__nav');
	
	//----------------------FIXED-HEADER-----------------------
		const headerFixed = (headerFixed, headerActive) => {
			const header =  document.querySelector(headerFixed),
						active = headerActive.replace(/\./, '');
	
			window.addEventListener('scroll', function() {
				const top = pageYOffset;
				
				if (top >= 90) {
					header.classList.add(active);
				} else {
					header.classList.remove(active);
				}
	
			});
	
		};
		// headerFixed('.header', '.header--active');
	
	//----------------------HAMBURGER-----------------------
		const hamburger = (hamburgerButton, hamburgerNav, hamburgerHeader) => {
			const button = document.querySelector(hamburgerButton),
						nav = document.querySelector(hamburgerNav),
						header = document.querySelector(hamburgerHeader);
	
			button.addEventListener('click', (e) => {
				button.classList.toggle('hamburger--active');
				nav.classList.toggle('header__nav--active');
				header.classList.toggle('header--menu');
			});
	
		};
		// hamburger('.hamburger', '.header__nav', '.header');
		
	//----------------------MODAL-----------------------
		const modals = (modalSelector) => {
			const	modal = document.querySelectorAll(modalSelector);

			if (modal) {
				let i = 1;

				modal.forEach(item => {
					const wrap = item.id;
					const link = document.querySelectorAll('.' + wrap);

					link.forEach(linkItem => {
						let close = item.querySelector('.close');
							if (linkItem) {
								linkItem.addEventListener('click', (e) => {
									if (e.target) {
										e.preventDefault();
									}
									item.classList.add('active');
								});
							}

							if (close) {
								close.addEventListener('click', () => {
									item.classList.remove('active');
								});
							}

						item.addEventListener('click', (e) => {
							if (e.target === item) {
								item.classList.remove('active');
							}
						});
					});
				});
			}

		};
		modals('.modal');

	//----------------------FORM-----------------------
		const forms = (formsSelector) => {
		const form = document.querySelectorAll(formsSelector);
		let i = 1;
		let img = 1;
		let lebel = 1;
		let prev = 1;

		form.forEach(item => {
			const elem = 'form--' + i++;
			item.classList.add(elem);

			let formId = item.id = (elem);
			let formParent = document.querySelector('#' + formId);

			formParent.addEventListener('submit', formSend);

			async function formSend(e) {
				e.preventDefault();

				let error = formValidate(item);

				let formData = new FormData(item);

				if (error === 0) {
					item.classList.add('_sending');
					let response = await fetch('sendmail.php', {
						method: 'POST',
						body: formData
					});

					if (response.ok) {
						let modalThanks = document.querySelector('#modal__thanks');
						formParent.parentNode.style.display = 'none';

						modalThanks.classList.add('active');
						item.reset();
						item.classList.remove('_sending');
					} else {
						alert('Ошибка при отправке');
						item.classList.remove('_sending');
					}

				}
			}

			function formValidate(item) {
				let error = 0;
				let formReq = formParent.querySelectorAll('._req');

				for (let index = 0; index < formReq.length; index++) {
					const input = formReq[index];
					// formRemoveError(input);

					if (input.classList.contains('_email')) {
						if(emailTest(input)) {
							formAddErrorEmail(input);
							error++;
						}
					} else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
						formAddErrorCheck(input);
						error++;
					} else {
						if (input.value === '') {
							formAddError(input);
							error++;
						}
					}
				}
				return error;
			}

			const formImgFile = formParent.querySelectorAll('.formImgFile');

			formImgFile.forEach(item => { 
				const elem = 'formImgFile--' + i++;

				let formId = item.id = (elem);
				let formParent = document.querySelector('#' + formId);

				const formImage = formParent.querySelector('.formImage');
				const formLebel = formParent.querySelector('.formLebel');
				const formPreview = formParent.querySelector('.formPreview');

				//картинка в форме
				let formImageNumber = 'formImage--' + img++;
				let formPreviewNumber = 'formPreview--' + prev++;
				
				formImage.id = (formImageNumber);
				formLebel.htmlFor = ('formImage--' + lebel++);
				formPreview.id = (formPreviewNumber);
				const formImageAdd = document.querySelector('#' + formImageNumber);

				// изменения в инпуте файл
				formImageAdd.addEventListener('change', () =>  {
					uploadFile(formImage.files[0]);
				});

				function uploadFile(file) {
			
					if (!['image/jpeg', 'image/png', 'image/gif', 'image/ico', 'application/pdf'].includes(file.type)) {
						alert('Только изображения');
						formImage.value = '';
						return;
					}
			
					if (file.size > 2 * 1024 * 1024) {
						alert('Размер менее 2 мб.');
						return;
					}
			
					var reader = new FileReader();
					reader.onload = function (e) {
						if(['application/pdf'].includes(file.type)) {
							formPreview.innerHTML = `Файл выбран`;
						}else{
							formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
						}
						
					};
					reader.onerror = function (e) {
						alert('Ошибка');
					};
					reader.readAsDataURL(file);
				}
			})

			function formAddError(input) {
				let div = document.createElement('div');
				div.classList.add("form__error");
				div.innerHTML = "Введите данные в поле";

				input.parentElement.append(div);
				input.parentElement.classList.add('_error');
				input.classList.add('_error');
			}

			function formAddErrorEmail(input) {
				let div = document.createElement('div');
				div.classList.add("form__error");
				div.innerHTML = "Введите свою почту";

				input.parentElement.append(div);
				input.parentElement.classList.add('_error');
				input.classList.add('_error');
			}

			function formAddErrorCheck(input) {
				let div = document.createElement('div');
				div.classList.add("form__error");
				div.innerHTML = "Согласие на обработку персональных данных";

				input.parentElement.append(div);
				input.parentElement.classList.add('_error');
				input.classList.add('_error');
			}

			function emailTest(input) {
				return !/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/. test(input.value);
			}

		});
		};
		forms('.form');


//--------------------------------Quiz--------------------------
	const DATA = [
		{
			question: `Вы согласны регулярно приезжать в онкоцентр (каждые 2-3 недели) 
								для обследования и лечения амбулаторно (в некоторых случаях приезжать для 
								обследования необходимо 2-3 дня подряд).
								`,
			answers: [
				{
					id: 1,
					value: 'Да',
					correct: true,
				},
				{
					id: 2,
					value: 'Нет',
					correct: false,
				},
			]
		},

		{
			question: `Вам требуется проводить в постели дневное время для дополнительного отдыха?`,
			answers: [
				{
					id: 3,
					value: 'Да',
					correct: true,
				},
				{
					id: 4,
					value: 'Нет',
					correct: true,
				},
			]
		},

		{
			question: `Вы проводите в постели больше половины дневного времени для отдыха?`,
			answers: [
				{
					id: 5,
					value: 'Да',
					correct: false,
				},
				{
					id: 6,
					value: 'Нет',
					correct: true,
				},
			]
		},

		{
			question: `У вас есть хронические заболевания?`,
			answers: [
				{
					id: 7,
					value: 'Да',
					correct: true,
				},
				{
					id: 8,
					value: 'Нет',
					correct: true,
				},
			]
		},

		{
			question: `У вас есть хронические заболевания, включая гипертоническую болезнь и/или 
									ишемическую болезнь сердца, и/или аритмию, и/или сахарный диабет (или другие) и вы 
									каждый день принимаете препараты и регулярно контролируете артериальное давление и/или уровень глюкозы?
									`,
			answers: [
				{
					id: 9,
					value: 'Да',
					correct: true,
				},
				{
					id: 10,
					value: 'Нет',
					correct: false,
				},
			]
		},

		{
			question: `За последние 6 мес вы переносили инфаркт или инсульт?`,
			answers: [
				{
					id: 11,
					value: 'Да',
					correct: false,
				},
				{
					id: 12,
					value: 'Нет',
					correct: true,
				},
			]
		},

		{
			question: `Подготовительный период перед лечением в клиническое исследовании (скрининг) 
								может занять от 7 до 28 дней (иногда больше). Вы согласны отложить начало лечения, 
								чтобы доктора могли выяснить подходит ли Вам исследование (если окажется, 
								что исследование Вам не подходит, это время будет потрачено напрасно)? 
				`,
			answers: [
				{
					id: 13,
					value: 'Да',
					correct: true,
				},
				{
					id: 14,
					value: 'Нет',
					correct: false,
				},
			]
		}
	];

	const localResults = {};

	const quiz = document.getElementById('quiz');
	const questions = document.getElementById('questions');
	const indicator = document.getElementById('indicator');
	const results = document.getElementById('results');
	const btnNext = document.getElementById('btn-next');
	const btnRestart = document.getElementById('btn-restart');

	const renderQuestions = (index) => {
		renderIndicator(index + 1);

		questions.dataset.currentStep = index;

		const renderAnswers = () => DATA[index].answers
			.map((answer) => `
				<li>
					<label>
						<input  class="answer-input" type="radio" name="${index}" value="${answer.id}">
						${answer.value}
					</label>
				</li>
			`)
			.join('');

		questions.innerHTML = `
			<div class="quiz-questions__item">
					<div class="quiz-questions__item_question"><h3>${DATA[index].question}</h3></div>
					<ul class="quiz-questions__item_answers">
						${renderAnswers()}
					</ul>
				</div>
		`;
	};

	const renderResults = () => {
		let content = '';
		if(localResults[0] === '2' || localResults[2] === '5' || localResults[4] === '10' || localResults[5] === '11' || localResults[6] === '14') {
			content += `
						<div class="quiz-results__item">
							<div class="quiz-results__item_question">Скорее всего клинические исследования Вам не подходят</div>
						</div>
			`;
		} else {
			content += `
						<div class="quiz-results__item">
							<div class="quiz-results__item_question">Вам стоит попробовать принять участие в клиническом исследовании</div>
						</div>
			`;
		}

		// const getAnswers = (questionIndex) => DATA[questionIndex].answers
		// .map((answer) => `<li>${answer.value}</li>`)
		// .join('');

		// DATA.forEach((question, index) => {
		// 	content += `
		// 		<div class="quiz-results__item">
		// 			<div class="quiz-results__item_question">11111${question.question}</div>
		// 			<ul class="quiz-results__item_answers">${getAnswers(index)}</ul>
		// 		</div>
			
		// 	`;
		// });

		results.innerHTML = content;
	};

	const renderIndicator = (currentStep) => {
		indicator.innerHTML = `${currentStep}/${DATA.length}`;
	};

	quiz.addEventListener('change', (event) => {
		if(event.target.classList.contains('answer-input')) {
			localResults[event.target.name] = event.target.value;
			btnNext.disabled = false;

		}
		
	});

	quiz.addEventListener('click', (event) => {
		if(event.target.classList.contains('btn-next')) {
			const nextQuestionIndex = Number(questions.dataset.currentStep) + 1;

			if(DATA.length === nextQuestionIndex) {
				//go to results
				questions.classList.add('questions-hidden');
				indicator.classList.add('indicator-hidden');
				results.classList.add('results-visible');
				btnNext.classList.add('btn-next-hidden');
				btnRestart.classList.add('btn-restart-visible');

				renderResults();
			}

			if (localResults[1] === '4' || localResults[3] === '8'){
					renderQuestions(nextQuestionIndex + 1);
			} else {
				//go to next question
				renderQuestions(nextQuestionIndex);
			}

			btnNext.disabled = true;
		}

		if(event.target.classList.contains('btn-restart')) {
			localResults = {};
			results.innerHTML = '';

			questions.classList.remove('questions-hidden');
			indicator.classList.remove('indicator-hidden');
			results.classList.remove('results-visible');
			btnNext.classList.remove('btn-next-hidden');
			btnRestart.classList.remove('btn-restart-visible');

			// renderQuestions(0);

		}
	});

	renderQuestions(0);

});
