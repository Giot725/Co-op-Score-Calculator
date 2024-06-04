document.getElementById("scoreCalculatorForm").addEventListener("submit", function (event) {
          event.preventDefault();
          calculateScore();
        });

      function calculateScore() {
        var formData = new FormData(
          document.getElementById("scoreCalculatorForm")
        );

        var contractLengthInDays = parseInt(formData.get("contractLengthInDays"));
        var contractLengthInSeconds = contractLengthInDays * 86400;
        var coopSize = parseInt(formData.get("coopSize"));
        var completionTime = parseFloat(formData.get("completionTime"));
        var coopGoals = parseInt(formData.get("coopGoals"));
        var goalsCompleted = parseInt(formData.get("goalsCompleted"));
        var grade = parseInt(formData.get("grade"));
        var yourContributionDropdown = document.getElementById("yourContributionDropdown");
        var eggsDeliveredDropdown = document.getElementById("eggsDeliveredDropdown");
        var yourContribution = parseFloat(formData.get("yourContribution")) * 10 ** yourContributionDropdown.value;
        var eggsDelivered = parseFloat(formData.get("eggsDelivered")) * 10 ** eggsDeliveredDropdown.value;
        var shipTime = parseFloat(formData.get("shipTime"));
        var shipBuff = parseFloat(formData.get("shipBuff"));
        var deflectorTime = parseFloat(formData.get("deflectorTime"));
        var deflectorBuff = parseFloat(formData.get("deflectorBuff"));
        var chickenRunsSent = parseInt(formData.get("chickenRunsSent"));
        var tokenValuesSent = parseInt(formData.get("tokenValuesSent"));
        var tokenValuesReceived = parseInt(formData.get("tokenValuesReceived"));
        var tokenTime = parseInt(formData.get("tokenTime")) * 60;

        // Calculate g
        let g;
        if (goalsCompleted >= 1) {
          g = goalsCompleted / coopGoals;
        } else {
          g = 0;
        }
        // Calculate G
        const gradeMapping = { 5: 7, 4: 5, 3: 3.5, 2: 2, 1: 1 };
        let G = gradeMapping[grade] || 0;
        // Calculate ratio
        let ratio = (yourContribution * coopSize) / eggsDelivered;
        // Calculate C
        let C;
        if (ratio <= 2.5) {
          C = 1 + 3 * Math.pow(ratio, 0.15);
        } else {
          C = 1 + 3.386486 + 0.02221 * Math.min(ratio, 12.5);
        }
        // Calculate B
        let tShip = shipTime * shipBuff;
        let tDeflector = deflectorTime * deflectorBuff * 10;
        let t = 0.0075 * (tShip + tDeflector);
        let B = 5 * Math.min(2, t / completionTime);
        // Calculate R
        let R = Math.min(6,chickenRunsSent * Math.max(0.3, 12 / (coopSize * contractLengthInDays)));
        // Calculate T
        let A = completionTime / tokenTime;
        let V;
        if (A <= 42) {
          V = 3;
        } else {
          V = 0.07 * A;
        }
        let T = 2 * ((Math.min(V, tokenValuesSent) + 4 * Math.min(V, Math.max(0, tokenValuesSent - tokenValuesReceived))) / V);
        // Calculate final score
        let score = Math.round(
          187.5 * g * G * C * (1 + contractLengthInDays / 3) * (1 + 4 * Math.pow(1 - completionTime / contractLengthInSeconds, 3)) * (1 + (B + R + T) / 100));

        // Update Score
        document.getElementById("result").innerText = "Score: " + score;
      }
