$(document).ready(function() {
  var $form = $('.form')
  var $submitBtn = $('.form .submit')
  var $errMsg = $('.form .errormessage')
  var $uidInput = $('.form [name=uid]')
  var $pwdInput = $('.form [name=pwd]')
  var requesting = false

  var validation = {
    uid: isRequired,
    pwd: isRequired
  }

  $submitBtn.click(function (e) {
    setErrorMsg('')
    validateForm(validation)

    if (isValid(validation) && !requesting) {
      requesting = true
      $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: '/login',
        data: JSON.stringify(getFormValue()),
        beforeSend: function () { $submitBtn.addClass('disabled') }
      }).done(function (res) {
        if (res) {
          location.href = '/'
        }
        else {
          setErrorMsg('User does not exist or password miss matched.')
        }
      }).fail(function () {
        setErrorMsg('Server error, try it later.')
        $submitBtn.removeClass('disabled')
      }).always(function () {
        requesting = false
      })
    }

    return false
  })

  $pwdInput.on('keydown', function (e) {
    if (e.keyCode === 13) {
      $submitBtn.click()
    }
  })

  function setErrorMsg (msg) {
    $submitBtn.removeClass('loading')
    $errMsg.text(msg)
  }

  function getValue (key) {
    switch(key) {
    case 'uid': return $uidInput.val()
    case 'pwd': return $pwdInput.val()
    default: return ''
    }
  }

  function getFormValue () {
    return {
      uid: getValue('uid'),
      pwd: getValue('pwd')
    }
  }

  function isValid (validation) {
    for (var key in validation) {
      if (!validation.hasOwnProperty(key)) continue
      if (!check(key, validation[key])) return false
    }
    return true
  }

  function check (name, validator) {
    var args = [].slice.call(arguments, 2)
    args.unshift(getValue(name))
    return validator.apply(null, args)
  }

  function isRequired (val) {
    return !!(val && val.length > 0)
  }

  function validateForm (validation) {
    for (var key in validation) {
      if (!validation.hasOwnProperty(key)) continue

      if (!check(key, validation[key])) setInvalid(key)
      else setValid(key)
    }
  }

  function setInvalid (key) {
    var $input = getInputByKey(key)
    $input.parent().addClass('has-error')
    $input.siblings('.help-block').removeClass('hide')
  }
  function setValid (key) {
    var $input = getInputByKey(key)
    $input.parent().removeClass('has-error')
    $input.siblings('.help-block').addClass('hide')
  }

  function getInputByKey (key) {
    switch (key) {
    case 'uid': return $uidInput
    case 'pwd': return $pwdInput
    default: return void 0
    }
  }
})
