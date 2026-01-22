	let MOLAR_MASS = 995.189;
	let currentUnit = 'pg/mL';
	let resultType = 'molar';

	function updateMolarMass() {
		const input = document.getElementById('molarMassInput').value;
		const parsed = parseFloat(input.replace(',', '.'));
		if (!isNaN(parsed) && parsed > 0) {
			MOLAR_MASS = parsed;
			document.getElementById('currentMolarMass').textContent = MOLAR_MASS.toLocaleString('ru-RU', {
				minimumFractionDigits: 0,
				maximumFractionDigits: 3
			});
			calculate();
		}
	}

	function setResultType(type) {
		resultType = type;
		document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
		event.target.classList.add('active');
		calculate();
	}

	function copyToClipboard(text) {
		navigator.clipboard.writeText(text).then(() => {
			event.target.classList.add('copied');
			setTimeout(() => event.target.classList.remove('copied'), 500);
		}).catch(err => {
			console.log('Failed to copy: ', err);
		});
	}

	function parseConcentration(value) {
		if (!value) return NaN;
		value = value.replace(',', '.');
		value = value.replace(/×/g, 'e').replace(/ /g, '').toLowerCase();
		return parseFloat(value);
	}

	function convertToMolar(concentration, unit) {
		let concInM = 0;
		switch (unit) {
			case 'pg/mL':
				concInM = (concentration * 1e-12 * 1000) / MOLAR_MASS;
				break;
			case 'ng/mL':
				concInM = (concentration * 1e-9 * 1000) / MOLAR_MASS;
				break;
			case 'mcg/mL':
				concInM = (concentration * 1e-6 * 1000) / MOLAR_MASS;
				break;
			case 'mg/mL':
				concInM = (concentration * 1e-3 * 1000) / MOLAR_MASS;
				break;
			case 'pg/L':
				concInM = (concentration * 1e-12) / MOLAR_MASS;
				break;
			case 'ng/L':
				concInM = (concentration * 1e-9) / MOLAR_MASS;
				break;
			case 'mcg/L':
				concInM = (concentration * 1e-6) / MOLAR_MASS;
				break;
			case 'mg/L':
				concInM = (concentration * 1e-3) / MOLAR_MASS;
				break;
			case 'pM':
				concInM = concentration * 1e-12;
				break;
			case 'nM':
				concInM = concentration * 1e-9;
				break;
			case 'uM':
				concInM = concentration * 1e-6;
				break;
			case 'mM':
				concInM = concentration * 1e-3;
				break;
			case 'M':
				concInM = concentration;
				break;
		}
		return concInM;
	}

	function formatScientific(num) {
		if (Math.abs(num) < 1e-15) return '0';
		const exp = Math.floor(Math.log10(Math.abs(num)));
		const coeff = num / Math.pow(10, exp);
		return `${coeff.toFixed(3)}⋅10<sup>${exp}</sup>`;
	}

	function formatPlain(num) {
		if (Math.abs(num) < 1e-15) return '0';
		return parseFloat(num.toFixed(5));
	}

	function formatLatex(num) {
		if (Math.abs(num) < 1e-15) return '$0$';
		const exp = Math.floor(Math.log10(Math.abs(num)));
		const coeff = num / Math.pow(10, exp);
		return `$${coeff.toFixed(3)} \\cdot 10^{${exp}}$`;
	}

	function generateMolarHTML() {
		const units = ['пМ', 'нМ', 'мкМ', 'мМ', 'М'];
		const ids = ['pm', 'nm', 'mkm', 'mm', 'm'];
		return `
                <div class="results-column full-width">
                    <div class="column-title">Молярные концентрации</div>
                    ${units.map((unit, i) => ` < div class = "result-item" > < span class = "unit" > $ {
			unit
		}: < /span> < div class = "format-row" > < div class = "format-item sci-format"
		onclick = "copyToClipboard(event.target.textContent)"
		id = "${ids[i]}_sci" > 0 < /div> < div class = "format-item plain-format"
		onclick = "copyToClipboard(event.target.textContent)"
		id = "${ids[i]}_plain" > 0 < /div> < div class = "format-item latex-format"
		onclick = "copyToClipboard(event.target.textContent)"
		id = "${ids[i]}_latex" > $0$ < /div> < /div > < /div>
		`).join('')}
                </div>
            `;
	}

	function generateMassHTML() {
		const units_ml = ['пг/мл', 'нг/мл', 'мкг/мл', 'мг/мл'];
		const units_l = ['пг/л', 'нг/л', 'мкг/л', 'мг/л'];
		return `
                <div class="results-column">
                    <div class="column-title">Массовая (мл)</div>
                    ${units_ml.map((unit, i) => ` < div class = "result-item" > < span class = "unit" > $ {
			unit
		}: < /span> < div class = "format-row" > < div class = "format-item sci-format"
		onclick = "copyToClipboard(event.target.textContent)"
		id = "ml_${i}_sci" > 0 < /div> < div class = "format-item plain-format"
		onclick = "copyToClipboard(event.target.textContent)"
		id = "ml_${i}_plain" > 0 < /div> < div class = "format-item latex-format"
		onclick = "copyToClipboard(event.target.textContent)"
		id = "ml_${i}_latex" > $0$ < /div> < /div > < /div>
		`).join('')}
                </div>
                <div class="results-column">
                    <div class="column-title">Массовая (л)</div>
                    ${units_l.map((unit, i) => ` < div class = "result-item" > < span class = "unit" > $ {
			unit
		}: < /span> < div class = "format-row" > < div class = "format-item sci-format"
		onclick = "copyToClipboard(event.target.textContent)"
		id = "l_${i}_sci" > 0 < /div> < div class = "format-item plain-format"
		onclick = "copyToClipboard(event.target.textContent)"
		id = "l_${i}_plain" > 0 < /div> < div class = "format-item latex-format"
		onclick = "copyToClipboard(event.target.textContent)"
		id = "l_${i}_latex" > $0$ < /div> < /div > < /div>
		`).join('')}
                </div>
            `;
	}

	function calculate() {
		const value = document.getElementById('concentration').value;
		if (!value) {
			document.getElementById('results').style.display = 'none';
			return;
		}
		const conc = parseConcentration(value);
		if (isNaN(conc) || conc <= 0) {
			document.getElementById('results').style.display = 'none';
			return;
		}
		const molar = convertToMolar(conc, currentUnit);
		if (resultType === 'molar') {
			document.getElementById('resultsGrid').innerHTML = generateMolarHTML();
			const multipliers = [1e12, 1e9, 1e6, 1e3, 1];
			const ids = ['pm', 'nm', 'mkm', 'mm', 'm'];
			multipliers.forEach((mult, i) => {
				const val = molar * mult;
				document.getElementById(ids[i] + '_sci').innerHTML = formatScientific(val);
				document.getElementById(ids[i] + '_plain').textContent = formatPlain(val);
				document.getElementById(ids[i] + '_latex').textContent = formatLatex(val);
			});
		} else {
			document.getElementById('resultsGrid').innerHTML = generateMassHTML();
			const ml_mult = [1e9 * 1e-3, 1e6 * 1e-3, 1e3 * 1e-3, 1e-3];
			const l_mult = [1e9 * 1e-6, 1e6 * 1e-6, 1e3 * 1e-6, 1e-6];
			ml_mult.forEach((mult, i) => {
				const val = molar * MOLAR_MASS * mult;
				document.getElementById(`ml_${i}_sci`).innerHTML = formatScientific(val);
				document.getElementById(`ml_${i}_plain`).textContent = formatPlain(val);
				document.getElementById(`ml_${i}_latex`).textContent = formatLatex(val);
			});
			l_mult.forEach((mult, i) => {
				const val = molar * MOLAR_MASS * mult;
				document.getElementById(`l_${i}_sci`).innerHTML = formatScientific(val);
				document.getElementById(`l_${i}_plain`).textContent = formatPlain(val);
				document.getElementById(`l_${i}_latex`).textContent = formatLatex(val);
			});
		}
		document.getElementById('results').style.display = 'block';
	}
	// Инициализация - ПРАВИЛЬНАЯ версия
	document.addEventListener('DOMContentLoaded', function() {
		document.querySelectorAll('.unit-btn').forEach(btn => {
			btn.addEventListener('click', function() {
				document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
				this.classList.add('active');
				currentUnit = this.dataset.unit;
				calculate();
			});
		});
		document.getElementById('concentration').addEventListener('input', calculate);
		updateMolarMass();
	});