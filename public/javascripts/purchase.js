function getProcessFee(amount) {
    // console.log('amount', amount);
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
    console.log('buy this month', level);
    if (level < 2) {
        $('#discountFee').attr('disabled', true);
        $('#ablePoint').text(0);
        $('#message').text('To use your HM Dollar, your monthly purchase must be over $20.');
    } else {
        $('#ablePoint').text(totalPoint);
    }
}
function feeProcess(salesAmount) {
    $('#processFee').text(processFee + '$');
    $('#totalPrice').text(strictFloat(productTotalAmount + processFee) + '$');
    $('#orderPrice').text(strictFloat(productTotalAmount + processFee) + '$');
    $('#deductionAmount').text(strictFloat(productTotalAmount - salesAmount) + '$');
    $('#finalPayment').text(strictFloat(salesAmount + processFee) + '$');
    $('#submitAmount').val(strictFloat(salesAmount + processFee));
}
function strictFloat(value) {
    return parseFloat(new Number(value).toFixed(2));
}

function calculateDiscount(point) {
    $('#paypalBtn').show();
    $('#pointBtn').hide();
    if (point < 0) {
        $('#discountFee').val(0);
    }
    if (point > ablePoint) {
        $('#discountFee').val(ablePoint);
    } if ($('#discountFee').val() >= strictFloat(productTotalAmount + processFee)) {
        $('#discountFee').val(strictFloat(productTotalAmount + processFee));
        $('#paypalBtn').hide();
        $('#pointBtn').show();
    }
    var amount = strictFloat(productTotalAmount) - strictFloat(point);
    feeProcess(amount);
}

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
    
    if ($('#noneMember').val() != undefined) {
        if ($('#noneMember').val() == '') {
            alert('Insert your email');
            $('#noneMember').focus();
            return false;
        }
        if (!validateMail($('#noneMember').val())) {
            alert('do not match email');
            return false;
        }
    }
    return true;
}
function customUpdate() {
    var account = '';
    if ($('#account').val() != undefined) {
        account = $('#account').val();
    }
    if ($('#noneMember').val() != undefined) {
        referralCode = $('#noneMember').val();
    }
    $('#custom').val(
        'code:' + referralCode + ',receiver:' + receivePhone + ',point:' + $('#discountFee').val()
        + ',accountNumber:' + account
    );
    console.log('custom', $('#custom').val());
}
function buyPoint() {
    if (beforePayment()) {
        customUpdate();
        document.getElementById('buyPoint').submit();
        // console.log('productId', $('input[name = productId]').val());
        // console.log('amount', $('input[name = pointAmount]').val());
        // console.log('receiver', $('input[name = receiver]').val());
        // console.log('token', $('input[name = token]').val());
    }
}
// buy item to pay pal.
function buyItem() {
    var result = true;
    if ($('#account').val() != undefined && $('#account').val() == '') {
        result = confirm("You have not entered your account number. Are you sure to proceed without one?");
    }
    if(result){
        if (beforePayment()) {
            customUpdate();
            alert("Please DO NOT CLOSE the Paypal window or click the Back button on your browser until the Payment Confirmation window pops up.");
            document.getElementById('buyPaypal').submit();
        }
    }else{
        $('#account').focus();
    }
}

$(window).bind("pageshow", function (event) {
    $('#discountFee').val(0);
    $('#term').attr('checked', false);
});