;(function () {

  /** Model */

  var Follow = require('../assets/follow.js/follow.js');

  var binders = {

    path: function (path) {
      $('#path').val(path);
    },

    name: function (name) {
      $('.name').text(name);

      if ( ! name ) {
        $('.name').hide();
      }
      else {
        $('.name').show();
      }
    },

    version: function (version) {
      $('.version').text(version);

      if ( ! version ) {
        $('.version-wrapper').hide();
      }
      else {
        $('.version-wrapper').show();
      }
    },

    action: function (action) {
      $('#action').text(model.actions[action].name);
    },
  }

  var model = {
    path: null,
    actions: [{ name: 'Init' }],
    action: 0,
    module: {
      package: {
        name: null,
        version: null
      }
    }
  };

  new Follow(model)
    
    .spy('path', binders.path)

    .spy('action', binders.action)

    .spy('module', function (module, previous, event) {
      binders.name(module.package ? module.package.name : null);
      binders.version(module.package ? module.package.version : null);
    });


  /** Controller */

  var ctrl = {
    switch: function (path) {
      $.ajax({
        url: '/api/switch',
        type: 'POST',
        data: { path: path }
      })
        .success(function (data) {
          if ( data.path === model.path ) {
            delete data.path;
            model.module = data;
          }
        });
    }
  };

  /** View events */

  $('#path').on('keyup', function () {
    model.path = $(this).val();
  });

  $('#path').on('change', function () {
    ctrl.switch($(this).val());
  });

})();
