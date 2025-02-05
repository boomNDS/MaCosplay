<script>
    // You can add any additional logic or imports here if needed
    function goToHomePage() {
        window.location.href = '/';
    }
</script>

<main>
    <h1>ยกเลิกการชำระเงิน</h1>
    <p>✨</p>
    <button class="btn btn-outline" on:click={goToHomePage}>กลับไปหน้าหลัก</button>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
    }

    button {
        margin-top: 20px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
    }
</style>
