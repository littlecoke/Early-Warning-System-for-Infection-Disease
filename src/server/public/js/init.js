/**
 *
 * Created by lty96117 on 5/19/2017.
 */

import '../css/init.css';

const utf = require('utf8');
const Axios = require('axios');
const qs = require('qs');
const _ = require('underscore');
$(document).ready(() => {

  //set the menu btn for mobile
  $(".button-collapse").sideNav({
    closeOnClick: true,
    draggable: true
  });


  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .3, // Opacity of modal background .5 default
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '0%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
    ready: (modal, trigger) => { // Callback for Modal open. Modal and trigger parameters available.
      window.dispatchEvent(new Event('resize'));
      // alert("Ready");
      // console.log(modal, trigger);

    },
    // complete: function () {
    //   alert('Closed');
    // } // Callback for Modal close
  });
  //
  //
  // $('#form-train').submit((e) => {
  //   e.preventDefault();
  //
  //   $.ajax({
  //     url: '/test',
  //     data: new FormData($('#form-train')[0]),
  //     // data: $('#form-train').serialize(),
  //
  //     type: 'POST',
  //     contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
  //     processData: false, // NEEDED, DON'T OMIT THIS
  //     success: function (data, textStatus) {
  //       console.log('succeeded with data: ' + this.data + "," + this.url + "," + textStatus);
  //
  //     },
  //     error: function (data, textStatus) {
  //       console.log('failed with data' + this.data + "," + this.url + "," + textStatus);
  //
  //     },
  //   });
  // });//prevents the submit});
  //get the signin form
  $('#form-signin').submit((e) => {
    e.preventDefault();//prevents the submit

    const obj = {
      name: $('#signin-name').val(),
      password: $('#signin-pwd').val()
    };
    console.log('post obj: ', obj);
    Axios.post('/userSignIn', obj)
      .then((res) => {
        console.log('res: ', res);
        console.log('res.data: ', res.data);

        if (res.data.success) {
          setTimeout(() => {
            $('#modal1').modal('close');
          }, 200);
          let $toastContent = res.data.info;
          Materialize.toast($toastContent, 3000, 'toast-success');
          sessionStorage.setItem('alarm-token', res.data.token);
          sessionStorage.setItem('myId', res.data.id);

          setTimeout(() => {
            window.location.href = '/?token=' + res.data.token;
          }, 500);
        } else {

          let $toastContent = res.data.info || $('<h4>INVALID REQUEST !</h4>');
          Materialize.toast($toastContent, 3000, 'toast-fail');
          sessionStorage.setItem('alarm-token', null);

        }
      }, (err) => {

        console.log('err: ', err);
        // let $toastContent = $('<h4>INVALID REQUEST !</h4>');
        let $toastContent = $('<h4>INVALID REQUEST !</h4>');
        Materialize.toast($toastContent, 3000, 'toast-fail');
        sessionStorage.setItem('alarm-token', null);
      });

  });

  $('#form-signup').submit((e) => {
    e.preventDefault();
    const obj = _.object($("#form-signup").serializeArray().map(function (v) {
      return [v.name, v.value];
    }));
    // let formData = new FormData(document.getElementById('form-signup'));
    // console.log('formData: ', formData);
    console.log(obj);

    // for patient
    Axios.post('http://localhost:8080/personalDiagnosis/registerUser.do', {

      // params: {
      username: obj.name,
      password: obj.password,
      address: obj.home_address,
      // }

    }).then((data) => {
      console.log(data.data);
      obj.id = data.data;
      Axios.post('/userSignUp', obj)
        .then((res) => {
          console.log('res: ', res);

          if (res.data.success) {
            setTimeout(() => {
              $('#modal1').modal('close');
            }, 200);
            let $toastContent = '注册成功！';
            Materialize.toast($toastContent, 3000, 'toast-success');
          } else {
            let $toastContent = '注册失败： ' + res.data.info;
            Materialize.toast($toastContent, 3000, 'toast-fail');
          }

        });

    }).catch(console.error);


  });

  const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
  $('#form-warning').submit(e => {
    e.preventDefault();
    const obj = _.object($("#form-warning").serializeArray().map(function (v) {
      return [v.name, v.value];
    }));
    let matrix = chunk(obj.matrix.split(' '), obj.city_number);
    console.log(myChart1);
    console.log(obj, matrix);
  });


  $('#checkFile').click(() => {
    const checkData = new FormData();
    // checkData.append('train_file1', document.getElementById('train_file1'));
    checkData.append('file2', $('#train_file2')[0].files[0]);

    console.log('file2:', $('#train_file2')[0].files[0]);
    Axios.post('http://localhost:8080/untitled3/check.do', checkData)
      .then(res => {
        console.log('res: ', res);
      }).catch(err => {
      console.log("ERROR: ", err);
    });
  });


  $('#training_train').submit((e) => {
    e.preventDefault();
    const obj = _.object($("#training_train").serializeArray().map(function (v) {
      return [v.name, v.value];
    }));
    const formData = new FormData();
    window.myObj = obj;
    console.log("form data: ", obj);
    for (let val in obj) {
      formData.append(val, obj[val]);
      console.log(val + ", " + obj[val]);
    }
    //upload file
    formData.append('file1', $('#train_file1')[0].files[0]);
    formData.append('file2', $('#train_file2')[0].files[0]);
    console.log('file2', $('#train_file2')[0].files[0]);
    console.log('file1', $('#train_file1')[0].files[0]);
    Axios.post('http://localhost:8080/untitled3/helloworld.do', formData, {}).then(res => {
      console.log('res: ', res);
      //
      // (() => {
      //   $('#refresh').click(() => {

      let circle = 1;
      let circleEl = document.getElementById('lastCircles');
      let globalError = document.getElementById('globalError');
      let input = document.getElementById('sr');
      let end = setInterval(() => {
        if (circle == 0) {
          clearInterval(end);
          console.log('done');
        } else {
          Axios.get('http://localhost:8080/untitled3/dong.do', {
            params: {
              sr: input.value
            }
          }, {
            headers: {
              'Content-Type': "application/x-www-form-urlencoded;charset=utf-8"
            }
          })
            .then(res => {
              let { data } = res;
              circleEl.innerHTML = "<h5>剩余轮数：" + data.circle + "</h5>";
              globalError.innerHTML = "<h5>全局错误率：" + (+data.error).toFixed(2) + "%</h5>";
              circle = data.circle;
            }).catch(err => {
            console.log("ERROR: ", err);
          });
        }
      }, 100);


      //   });
      //
      // })();


    }).catch(console.log);
  });


  $('#training_test').submit((e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file1', $('#test_file1')[0].files[0]);
      formData.append('file2', $('#test_file2')[0].files[0]);
      Axios
        .post('http://localhost:8080/untitled3/predict.do', formData, {})
        .then(res => {
          console.log('res: ', res);
          document.getElementById('accuracy').innerHTML = "精确度" + res.data;
        })
        .catch(console.log);
    }
  );

  $('#training_apply').submit((e) => {
    e.preventDefault();

    const obj = _.object($("#training_apply").serializeArray().map(function (v) {
      return [v.name, v.value];
    }));
    const formData = new FormData();
    console.log("apply form data: ", obj);
    window.obj = obj;
    for (let val in obj) {
      formData.append(val, obj[val]);
      console.log(val + ", " + obj[val]);
    }

    //
    // let testObj = {
    //   sex: 1,
    //   age: 67,
    //   hurttype: 3,
    //   trestbps: 160,
    //   chol: 286,
    //   fbs: 1,
    //   restecg: 2,
    //   thalach: 108,
    //   exang: 1,
    //   oldpeak: 0.15,
    //   slope: 1,
    //   ca: 3,
    //   thal: 0,
    //   hxb: 1,
    //   nb: 0,
    //   nbtk: 1,
    //   xj: 1,
    //   xt: 140,
    //   xns: 10,
    //   xjg: 1.2,
    //   hxbjs: 4.5,
    //   gxy: 0,
    //   tnb: 0,
    //   sy: 1,
    //   zsz: 0,
    //   px: 0,
    // };
    // for (let val in testObj) {
    //   formData.append(val, testObj[val]);
    //   console.log(val + ", " + testObj[val]);
    // }


    formData.append('file1', $('#apply_file1')[0].files[0]);
    formData.append('file2', $('#apply_file2')[0].files[0]);

    Axios.post('http://localhost:8080/untitled3/page.do', formData)
      .then((res) => {
        document.getElementById('trainingRes').innerHTML = "训练结果: " + res.data;
      })
      .catch(console.log);


  });


  $('#loadHospital').click(e => {

    let obj = {};

    obj.patient_id = 54100;

    $.ajax({
      url: "http://localhost:8080/personalDiagnosis/recommendHospital.do",
      type: "POST",
      data: obj,
      success: function (data) {
        console.log(eval(data));
        let list = document.getElementById('collection');

      },
      error: function () {

      }
    });

    //
    // Axios.post('http://localhost:8080/personalDiagnosis/recommendHospital.do', qs.stringify(obj), {
    //   headers: {
    //     'Content-Type': "application/x-www-form-urlencoded"
    //   }
    // }).then(console.log).catch(console.error);
  });


  $('#diagnosis-form').submit(e => {
    e.preventDefault();
    const obj = _.object($("#diagnosis-form").serializeArray().map(function (v) {
      return [v.name, v.value];
    }));

    // const formData = new FormData(document.getElementById('diagnosis-form'));
    // console.log("Form data:", obj);


    $.ajax({
      // url: "http://45.55.148.21:8080/BigDataHealth/personalDiagnosis/diagnosis.do",
      url: "http://localhost:8080/personalDiagnosis/diagnosis.do",
      type: "POST",
      data: obj,
      success: function (datas) {
        datas = eval(datas);
        console.log(datas);

        let tmp = "";
        let name = "";
        let no = "";
        let similarity = "";
        window.data = datas;
        for (let val in datas) {
          console.log(val);
          name = datas[val].name;
          no = datas[val].no;
          similarity = datas[val].similarity;
          tmp += "<tr><td>" + name + "</td><td>" + no + "</td><td>" + similarity + "</td></tr>";
        }

        document.getElementById('diagnosis-body').innerHTML = tmp;
      },
      error: function () {

      }
    });


    // $.ajax({
    //   type: "POST",
    //   url: "http://45.55.148.21:8080/BigDataHealth/personalDiagnosis/diagnosis.do",
    //   data: formData,
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   scriptCharset: 'utf-8',
    //   success: (res) => {
    //     console.log(res.data[0].name);
    //
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   }
    //
    // });
    let json_obj = JSON.stringify(obj);
    // Axios.post('http://localhost:8080/personalDiagnosis/diagnosis.do', formData, {
    //   Axios.post('http://45.55.148.21:8080/BigDataHealth/personalDiagnosis/diagnosis.do', {
    //     "symptom": "皮肤干燥，皲裂"
    //   }, {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    //     },
    //     // scriptCharset: 'utf-8'
    //
    //   }).then(res => {
    //     console.log('res: ', res.data[0].name);
    //     // Materialize.toast(res.data[0].name, 4000);
    //     // let div = document.getElementById('res_test');
    //     // div.innerText = utf.decode(res.data[0].name);
    //     let tmp = "";
    //     let name = "";
    //     let no = "";
    //     let similarity = "";
    //     console.log(res.data);
    //     window.data = res.data;
    //     for (let val in res.data) {
    //       console.log(val);
    //       name = res.data[val].name;
    //       no = res.data[val].no;
    //       similarity = res.data[val].similarity;
    //       tmp += "<tr><td>" + name + "</td><td>" + no + "</td><td>" + similarity + "</td></tr>";
    //     }
    //
    //     document.getElementById('diagnosis-body').innerHTML = tmp;
    //   }).catch(err => {
    //     console.log("Error: ", err);
    //   });
  });

  $('#health_dairy').submit(e => {
    e.preventDefault();

    const obj = _.object($("#health_dairy").serializeArray().map(function (v) {
      return [v.name, v.value];
    }));
    const formData = new FormData();
    console.log("apply form data: ", obj);
    window.obj = obj;
    for (let val in obj) {
      formData.append("key", obj[val]);
      console.log(val + ", " + obj[val]);
    }

    Axios.post('http://127.0.0.1:8000/svm/api/', formData).then(({ data }) => {
      console.log('res: ', data);
      console.log(data.result === -1);

      if (data.result === -1) {
        document.getElementById('dairyRes').innerHTML = "分析结果: \n" + '根据您近期的日记与聊天记录，您近期的心理状态一般，建议您做心理调查问卷进行测试。建议咨询心理医生';

      } else if (data.result === 1) {

        document.getElementById('dairyRes').innerHTML = "分析结果: \n" + '根据您近期的日记与聊天记录，您当前的心理状态良好，希望您继续保持这种状态。';
      } else {
        document.getElementById('dairyRes').innerHTML = 'INVALID REQUEST';
      }


    }).catch(console.error)
  });

  $('#mental-test').submit(e => {
    e.preventDefault();
    const obj = _.object($("#mental-test").serializeArray().map(function (v) {
      return [v.name, v.value];
    }));
    console.log("FormInfo: ", obj);
    Axios.post('/mentalTest', obj).then(res => {
      console.log('res: ', res.data);
      document.getElementById('mental_test_data').innerHTML = res.data;
    });
  })


// for four systems redirect


  function getOnClick(id) {
    return function () {
      const token = sessionStorage.getItem('alarm-token');
      if (token === null) {
        Materialize.toast('Unauthorized, need to login in first!', 3000, 'toast-fail');
        console.log('Unauthorized!!');
        // window.location.href = '/';
      } else {
        window.location.href = '/' + id + '?token=' + token;
      }
    }
  }

  $('.warning_auth').click(getOnClick('warning'));
  $('.training_auth').click(getOnClick('training'));
  $('.diagnosis_auth').click(getOnClick('diagnosis'));
  $('.health_auth').click(getOnClick('health'));

  $('.index_auth').click(function () {
    const token = sessionStorage.getItem('alarm-token');
    if (token === null) {
      window.location.href = '/';
      console.log('token is null');
    } else {
      window.location.href = '/?token=' + token;
    }
  });

// $('#id_warning').click(() => {
//   const token = sessionStorage.getItem('alarm-token');
//   if (token === null) {
//     // window.location.href = '/';
//     Materialize.toast('Unauthorized, need to login in first!', 3000, 'toast-fail');
//     console.log('Unauthorized!!');
//   }
//   console.log(token);
//   if (token !== null) {
//     window.location.href = '/' + '#id_warning'.substring(4) + '?token=' + token;
//   }
// });

  $(function () {
    $('#mobile-nav').perfectScrollbar();
    $('#modal1').perfectScrollbar();
  });

  let timer = setInterval(() => {
    $('.carousel').carousel('next');
  }, 2000);
  $('.carousel.carousel-slider')
    .carousel({ fullWidth: true });
// .on('click', (e) => {
//   clearInterval(timer);
//   // alert('clicked me!');
//   console.log('click cleared setInterval func...');
//   $(this).off(e);// unbind successfully!
// });


  $("a[href='#top']").click(() => {
    $('html, body').animate({ scrollTop: 0 }, 400);
    return false;
  });
  $('select').material_select();
  $('textarea#textarea1').characterCounter();

  $('.demo_link').attr('href', 'javascript:;');
})
;
console.log('initialization completed');