document.getElementById('doseForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission
    
    // Retrieve input values
    const weight = parseFloat(document.getElementById('weight').value);
    const category = document.querySelector('input[name="category"]:checked').value;
    const outputDiv = document.getElementById('output');
    
    // Clear any previous output
    outputDiv.innerHTML = "";
    
    // Validate the weight input
    if (isNaN(weight) || weight <= 0) {
      outputDiv.innerHTML = "<p>Please enter a valid positive weight.</p>";
      return;
    }
    
    // Check for overweight condition (≥40kg) for all categories
    if (weight >= 40) {
      outputDiv.innerHTML = "<p>The dog appears to be overweight. Please advise the owner to bring the dog in for a check-up.</p>";
      return;
    }
    
    // Define constants and initial variables
    const PRESCRIPTION_CHARGE = 4.00;
    let tablets = 0;
    let tabletType = "";
    let tapewormDrop = 0;
    let tabletCost = 0;
    let checkupWarning = "";

    // Add warning for weight between 35-39kg
    if (weight >= 35 && weight < 40) {
      checkupWarning = "<p class='warning'>The dog's weight is approaching the upper limit. A check-up is recommended.</p>";
    }
    
    // Calculate dosage and costs based on the category
    if (category === "puppy") {
      // Puppies (under 12 weeks) get 1 Promax Junior Tablet
      tablets = 1;
      tabletType = "Promax Junior Tablet";
      tabletCost = 1.25;
    } else if (category === "nursing") {
      // Nursing bitches get 1 Promax Nursing Tablet per 5kg, plus 1 tapeworm drop
      tablets = Math.floor(weight / 5);
      if (tablets < 1) {
        tablets = 1;
      }
      tabletType = "Promax Nursing Tablet";
      tabletCost = 3.00;
      tapewormDrop = 1;
    } else if (category === "adult") {
      // Adult dogs: determine tablets based on weight ranges
      if (weight < 10) {
        tablets = 1;
      } else if (weight >= 10 && weight < 20) {
        tablets = 2;
      } else if (weight >= 20 && weight < 25) {
        tablets = 3;
      } else if (weight >= 25 && weight < 30) {
        tablets = 4;
      } else if (weight >= 30 && weight < 35) {
        tablets = 5;
      } else if (weight >= 35 && weight < 40) {
        tablets = 6;
      }
      tabletType = "Promax Tablet";
      tabletCost = 1.25;
    }
    
    // Calculate costs
    const tabletsCost = tablets * tabletCost;
    const tapewormCost = tapewormDrop * 3.00;
    const totalCost = tabletsCost + tapewormCost + PRESCRIPTION_CHARGE;
    
    // Build the output HTML
    let outputHTML = `<h2>Prescription Details</h2>`;
    if (checkupWarning) {
      outputHTML += checkupWarning;
    }
    outputHTML += `<p><strong>Dog Category:</strong> ${category.charAt(0).toUpperCase() + category.slice(1)}</p>`;
    outputHTML += `<p><strong>Weight:</strong> ${weight} kg</p>`;
    outputHTML += `<p><strong>Medication:</strong></p>`;
    outputHTML += `<ul>`;
    outputHTML += `<li>${tablets} x ${tabletType} (@ £${tabletCost.toFixed(2)} each) = £${tabletsCost.toFixed(2)}</li>`;
    if (tapewormDrop > 0) {
      outputHTML += `<li>${tapewormDrop} x Tapeworm Drop (@ £3.00 each) = £${tapewormCost.toFixed(2)}</li>`;
    }
    outputHTML += `</ul>`;
    outputHTML += `<p><strong>Prescription Charge:</strong> £${PRESCRIPTION_CHARGE.toFixed(2)}</p>`;
    outputHTML += `<p><strong>Total Cost:</strong> £${totalCost.toFixed(2)}</p>`;
    
    // Display the result in the output section
    outputDiv.innerHTML = outputHTML;
    
    // Show share options after calculation
    const shareOptions = document.getElementById('share-options');
    shareOptions.style.display = 'flex';
});

// Add live update functionality
function updateLivePreview() {
    const weight = parseFloat(document.getElementById('weight').value);
    const category = document.querySelector('input[name="category"]:checked').value;
    const liveMedication = document.getElementById('live-medication');
    const liveCost = document.getElementById('live-cost');
    const livePreview = document.getElementById('live-preview');

    if (isNaN(weight) || weight <= 0) {
        livePreview.classList.remove('has-content');
        return;
    }

    // Constants
    const PRESCRIPTION_CHARGE = 4.00;
    let tablets = 0;
    let tabletType = "";
    let tabletCost = 0;
    let tapewormDrop = 0;

    // Calculate dosage based on category
    if (category === "puppy") {
        tablets = 1;
        tabletType = "Promax Junior Tablet";
        tabletCost = 1.25;
    } else if (category === "nursing") {
        tablets = Math.max(1, Math.floor(weight / 5));
        tabletType = "Promax Nursing Tablet";
        tabletCost = 3.00;
        tapewormDrop = 1;
    } else {
        if (weight < 10) tablets = 1;
        else if (weight < 20) tablets = 2;
        else if (weight < 25) tablets = 3;
        else if (weight < 30) tablets = 4;
        else if (weight < 35) tablets = 5;
        else tablets = 6;
        tabletType = "Promax Tablet";
        tabletCost = 1.25;
    }

    const tabletsCost = tablets * tabletCost;
    const tapewormCost = tapewormDrop * 3.00;
    const totalCost = tabletsCost + tapewormCost + PRESCRIPTION_CHARGE;

    liveMedication.textContent = `${tablets} x ${tabletType}${tapewormDrop ? ' + Tapeworm Drop' : ''}`;
    liveCost.textContent = `Estimated Total: £${totalCost.toFixed(2)}`;
    livePreview.classList.add('has-content');
}

// Add event listeners for live updates
document.getElementById('weight').addEventListener('input', updateLivePreview);
document.querySelectorAll('input[name="category"]').forEach(radio => {
    radio.addEventListener('change', updateLivePreview);
});

// Initialize live preview
updateLivePreview();

// Add the html2pdf library
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
document.head.appendChild(script);

// Download PDF functionality
document.getElementById('downloadPDF').addEventListener('click', function() {
  // Create PDF using html2pdf instead of jsPDF for better HTML rendering
  const outputSection = document.getElementById('output');
  const element = document.createElement('div');
  
  // Create header
  const header = document.createElement('div');
  header.innerHTML = `
    <h1 style="color: #333; margin-bottom: 20px;">Dog Worming Prescription</h1>
    <p style="margin-bottom: 10px;">Date: ${new Date().toLocaleDateString()}</p>
  `;
  element.appendChild(header);
  
  // Add prescription content
  const content = document.createElement('div');
  content.innerHTML = outputSection.innerHTML;
  element.appendChild(content);
  
  // Add footer
  const footer = document.createElement('div');
  footer.innerHTML = `
    <div style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
      <p>Veterinary Clinic Prescription</p>
      <p>This is an official prescription document.</p>
    </div>
  `;
  element.appendChild(footer);

  // PDF options
  const opt = {
    margin: 1,
    filename: 'dog_worming_prescription.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
  };

  // Generate PDF
  html2pdf().set(opt).from(element).save();
});

// Email functionality
document.getElementById('emailPrescription').addEventListener('click', function() {
  const output = document.getElementById('output');
  if (!output.innerHTML.trim()) {
    alert('Please calculate prescription details first.');
    return;
  }

  // Get prescription details
  const prescriptionDetails = output.innerHTML;
  const subject = 'Dog Worming Prescription Details';
  const body = prescriptionDetails.replace(/<[^>]*>/g, '\n').trim();

  // Open default email client
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

// Clear share options when form is reset
document.getElementById('resetBtn').addEventListener('click', function() {
  const shareOptions = document.getElementById('share-options');
  shareOptions.style.display = 'none';
});
