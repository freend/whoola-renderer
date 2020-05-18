function getProcessFee(amount) {
    console.log('amount', amount);
    if (amount >= 5.00 && amount < 10) {
        return 1.00;
    }
    if (amount >= 10 && amount < 20) {
        return strictFloat(Math.ceil((amount * 0.09) * 100) / 100);
    }
    if (amount >= 20 && amount < 30) {
        return strictFloat(Math.ceil((amount * 0.08) * 100) / 100);
    }
    if (amount >= 30) {
        return strictFloat(Math.ceil((amount * 0.07) * 100) / 100);
    }

    return 0.6;
}
function isAblePoint() {
    console.log('buy this month', buyThisMonth);
    if (buyThisMonth < 20) {
        $('#discountFee').attr('disabled', true);
        $('#ablePoint').text(0);
        $('#message').text('To use your HM Dollar, your monthly purchase must be over $20.');
    } else {
        $('#ablePoint').text(totalPoint);
    }
}
function feeProcess(salesAmount) {
    console.log('sales amount : ' + salesAmount + ', processFee : ' + processFee);
    $('#processFee').text(processFee + '$');
    $('#totalPrice').text(strictFloat(productTotalAmount + processFee) + '$');
    $('#orderPrice').text(strictFloat(productTotalAmount + processFee) + '$');
    $('#deductionAmount').text(strictFloat(productTotalAmount - salesAmount) + '$');
    console.log('>>', strictFloat(salesAmount + processFee));
    $('#finalPayment').text(strictFloat(salesAmount + processFee) + '$');
    $('#submitAmount').val(strictFloat(salesAmount + processFee));
    $('#custom').val('code:<%= referralCode %>\,receiver:<%= receiverPhone %>,point:' + $('#discountFee').val());
}
function strictFloat(value) {
    return parseFloat(new Number(value).toFixed(2));
}

// var inputPoint;
$('#discountFee').on("propertychange change keyup paste input", function () {
    const point = $(this);
    $('#paypalBtn').show();
    $('#pointBtn').hide();
    if ($(this).val() < 0) {
        $(this).val(0);
    }
    if (point.val() > ablePoint) {
        point.val(ablePoint);
    } if (point.val() >= strictFloat(productTotalAmount + processFee)) {
        point.val(strictFloat(productTotalAmount + processFee));
        $('#paypalBtn').hide();
        $('#pointBtn').show();
    }
    var amount = strictFloat(productTotalAmount) - strictFloat(point.val());
    feeProcess(amount);
});

function beforePayment() {
    if (!$('#term').is(":checked")) {
        alert('Please agree to the terms');
        return false;
    } else {
        if (isPayable == false) {
            alert('order is temporary unavailable');
            return false;
        }
    }
    return true;
}
function buyPoint() {
    if (beforePayment()) {
        document.getElementById('buyPoint').submit();
        console.log('productId', $('input[name = productId]').val());
        console.log('amount', $('input[name = pointAmount]').val());
        console.log('receiver', $('input[name = receiver]').val());
        console.log('token', $('input[name = token]').val());
    }
}
// buy item to pay pal.
function buyItem() {
    if (beforePayment()) {
        alert("Please DO NOT CLOSE the Paypal window or click the Back button on your browser until the Payment Confirmation window pops up.");
        document.getElementById('buyPaypal').submit();
    }
}

//click back before setting
/*
$(window).bind("pageshow", function (event) {
    const match = $('#match');
    const value = $('#phoneId').val();
    if (/^[1-9][0-9]{6,14}$/.test(value)) {
        match.css("color", 'blue');
        match.text('Valid Phone Number');
    } else {
        if (value != '') {
            match.css("color", 'red');
            match.text('Invalid Phone Number');
        }
    }
*/