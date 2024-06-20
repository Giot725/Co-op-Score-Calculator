document.getElementById("scoreCalculatorForm").addEventListener("submit", function (event) {
    event.preventDefault();
    calculateScore();
});

function textToNumber(inputText) {
    const multipliers = {
        'K': 1e3, // Thousand
        'M': 1e6, // Million
        'B': 1e9, // Billion
        'T': 1e12, // Trillion
        'q': 1e15, // Quadrillion
        'Q': 1e18, // Quintillion
        's': 1e21, // Sextillion
        'S': 1e24, // Septillion
        'o': 1e27, // Octillion
        'N': 1e30, // Nonillion
        'd': 1e33, // Decillion
        'U': 1e36, // Undecillion
        'D': 1e39, // Duodecillion
        'Td': 1e42, // Tredecillion
        'qd': 1e45, // Quattuordecillion
        'Qd': 1e48, // Quindecillion
        'sd': 1e51, // Sexdecillion
        'Sd': 1e54, // Septendecillion
        'Od': 1e57, // Octodecillion
        'Nd': 1e60, // Novemdecillion
        'V': 1e63, // Vigintillion
        'uV': 1e66, // Unvigintillion
        'dV': 1e69, // Duovigintillion
        'tV': 1e72, // Tresvigintillion
        'qV': 1e75, // Quattuorvigintillion
        'QV': 1e78, // Quinvigintillion
        'sV': 1e81, // Sesvigintillion
        'SV': 1e84, // Septenvigintillion
        'OV': 1e87, // Octovigintillion
        'NV': 1e90, // Novemvigintillion
        'tT': 1e93, // Trigintillion
    };

    let numStr = '';
    let suffix = '';

    for (let i = 0; i < inputText.length; i++) {
        const char = inputText[i];
        if (char >= '0' && char <= '9' || char === '.') {
            numStr += char;
        } else {
            suffix = inputText.slice(i).trim();
            break;
        }
    }

    // checks to see if number was input
    const number = parseFloat(numStr);
    if (isNaN(number)) {
        alert("Invalid number format.");
        throw new Error("Invalid number format.");
    }

    // checks for unrecognized suffixes
    if (suffix && !multipliers[suffix]) {
        alert(`Unrecognized suffix: '${suffix}'`);
        throw new Error(`Unrecognized suffix: '${suffix}'`);
    }

    const multiplier = multipliers[suffix] || 1;
    const finalNumber = number * multiplier;

    return finalNumber;
}

function calculateScore() {
    const form = document.getElementById("scoreCalculatorForm");
    const formData = new FormData(form);

    const originalLengthInDays = parseInt(formData.get("originalLengthInDays"));
    const gradePoints = formData.get("gradePoints");
    const yourEggsDelivered = textToNumber(formData.get("yourEggsDelivered"));
    const coopEggsDelivered = textToNumber(formData.get("coopEggsDelivered"));
    const coopSize = parseFloat(formData.get("coopSize"));
    const goal1 = textToNumber(formData.get("goal1"));
    const goal3 = textToNumber(formData.get("goal3"));
    const timeElapsedDays = parseInt(formData.get("timeElapsedDays"));
    const timeElapsedHours = parseInt(formData.get("timeElapsedHours"));
    const timeElapsedMinutes = parseInt(formData.get("timeElapsedMinutes"));
    const tachyonDeflectorBoost = parseInt(formData.get("tachyonDeflectorBoost"));
    const shipInABottleBoost = parseInt(formData.get("shipInABottleBoost"));
    const tachyonDeflectorTimeEquippedDays = parseInt(formData.get("tachyonDeflectorTimeEquippedDays"));
    const tachyonDeflectorTimeEquippedHours = parseInt(formData.get("tachyonDeflectorTimeEquippedHours"));
    const tachyonDeflectorTimeEquippedMinutes = parseInt(formData.get("tachyonDeflectorTimeEquippedMinutes"));
    const shipInABottleTimeEquippedDays = parseInt(formData.get("shipInABottleTimeEquippedDays"));
    const shipInABottleTimeEquippedHours = parseInt(formData.get("shipInABottleTimeEquippedHours"));
    const shipInABottleTimeEquippedMinutes = parseInt(formData.get("shipInABottleTimeEquippedMinutes"));
    const chickenRunsSent = parseInt(formData.get("chickenRunsSent"));

    const originalLengthInSeconds = originalLengthInDays * 86400;
    const timeElapsedSeconds = timeElapsedDays * 86400 + timeElapsedHours * 3600 + timeElapsedMinutes * 60;
    const tachyonDeflectorTimeEquippedSeconds = tachyonDeflectorTimeEquippedDays * 86400 + tachyonDeflectorTimeEquippedHours * 3600 + tachyonDeflectorTimeEquippedMinutes * 60;
    const shipInABottleTimeEquippedSeconds = shipInABottleTimeEquippedDays * 86400 + shipInABottleTimeEquippedHours * 3600 + shipInABottleTimeEquippedMinutes * 60;

    const basePoints = 1;
    const durationPoints = basePoints + (1 / 3) * originalLengthInDays;

    const contributionRatio = yourEggsDelivered * coopSize / Math.min(goal3, Math.max(goal1, coopEggsDelivered));

    let contributionFactor;
    if (contributionRatio <= 2.5) {
        contributionFactor = 3 * Math.pow(contributionRatio, 0.15) + 1;
    } else {
        contributionFactor = 0.02221 * Math.min(contributionRatio, 12.5) + 4.386486;
    }

    const completionTimeBonus = 4 * Math.pow(1 - timeElapsedSeconds / originalLengthInSeconds, 3) + 1;

    const buffTimeValue = (tachyonDeflectorTimeEquippedSeconds * 7.5 * tachyonDeflectorBoost / 100) + (shipInABottleTimeEquippedSeconds * 0.75 * shipInABottleBoost / 100);

    const b = 5 * Math.min(2, buffTimeValue / timeElapsedSeconds);

    const maxChickenRuns = Math.round(Math.min(20, originalLengthInDays * coopSize / 2));

    const r = Math.min(6, Math.min(chickenRunsSent, maxChickenRuns) * Math.max(0.3, 12 / coopSize * originalLengthInDays));

    const t = 0;

    const teamworkScore = (b + r + t) / 19;
    const teamworkBonus = teamworkScore * 0.19 + 1;

    let score = 187.5;
    score = score * durationPoints;
    score = score * gradePoints;
    score = score * contributionFactor;
    score = score * completionTimeBonus;
    score = Math.round(score * teamworkBonus);

    console.log("Max chicken runs", maxChickenRuns);
    console.log("Teamwork score:", teamworkScore);
    console.log("Duration Points:", durationPoints);
    console.log("Grade points:", gradePoints);
    console.log("Contribution Factor:", contributionFactor);
    console.log("Completion Time Bonus:", completionTimeBonus);
    console.log("Teamwork Bonus:", teamworkBonus);
    console.log("Score:", score);

    document.getElementById("result").innerText = "Score: " + score;
}
