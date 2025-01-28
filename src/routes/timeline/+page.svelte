<div class="timeline">
    <div class="timeline-item">
        <div class="timeline-year">1 มกราคม 2025</div>
        <div class="timeline-content">
            <h3>เช่าชุด Ashi</h3>
            <p>
                ชุดเปื้อน
            </p>
        </div>
    </div>
    <div class="timeline-item">
        <div class="timeline-year">1998</div>
        <div class="timeline-content">
            <h3>iMac</h3>
            <p>
                iMac is a family of all-in-one Mac desktop computers designed and built by Apple Inc. It has been the primary part of Apple's consumer desktop offerings since its debut in August 1998, and has evolved through seven distinct forms.
            </p>
        </div>
    </div>
    <div class="timeline-item">
        <div class="timeline-year">2001</div>
        <div class="timeline-content">
            <h3>iPod</h3>
            <p>
                The iPod is a discontinued series of portable media players and multi-purpose mobile devices designed and marketed by Apple Inc.
            </p>
        </div>
    </div>
</div>
<style>
.timeline {
    position: relative;
    padding: 40px 0; /* Increased top and bottom padding */
    margin: 0 auto;
    max-width: 600px; /* Adjust as needed */
}

.timeline-item {
    position: relative;
    margin: 60px 0; /* Increased margin for better spacing between items */
    padding-left: 60px; /* Space for the year */
}

.timeline-year {
    position: absolute;
    left: 0;
    top: 0;
    font-weight: bold;
    font-size: 1.5em; /* Adjust font size */
    padding-bottom: 50px; /* Increased space below the year */
}

.timeline-content {
    background: #f9f9f9; /* Background color for the content */
    border-radius: 5px;
    padding: 50px; /* Increased padding for content */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-top: 10px; /* Space between year and content */
}

.timeline-content h3 {
    margin: 0 0 10px; /* Space below the title */
    font-size: 1.3em; /* Title font size */
}

.timeline-item::before {
    content: '';
    position: absolute;
    left: 20px; /* Adjust as needed */
    top: 20px; /* Adjust to fit the timeline */
    height: calc(100% - 20px); /* Adjust to fit the timeline */
    width: 2px; /* Line width */
    background: #ccc; /* Line color */
}
</style>