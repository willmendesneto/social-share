/* globals alert, console, define, module */
(function(window) {
  'use strict';

  /**
   * [initBatteryStatus description]
   * @param  {[type]} opts Object {batteryStatusVerification: true, verificationInterval, 100000}
   * @return {[type]}      [description]
   */
  function Battery(opts) {
    var battery  = navigator.battery || navigator.mozBattery,
      level  = battery.level * 100
    ;

    if (battery.charging) {
      console.log('Carregando');
    } else if (level > 65) {
      console.log('Carregando');
      console.log('Carga alta: ' + level + '%');
    } else if (level >= 35 ) {
      console.log('Carga média: ' + level + '%');
    } else {
      alert('A bateria está em ' + level + '% ! Por favor recarregue urgente!');
      console.log('A bateria está em ' + level + '% ! Por favor recarregue urgente!');
    }

    if (!battery.charging) {
      console.log('Carga atual: ' + level + '%');
    }

    //  Verifica se a aplicacao deve verificar a bateria do dispositivo
    if (!!opts.batteryStatusVerification) {
      //  Iniciando verificacao de bateria a cada 10 minutos
      setInterval(Battery.initBatteryStatus, opts.verificationInterval || 100000);
    }
  }

  if (typeof define !== 'undefined' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function() {
      return Battery;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Battery.attach;
    module.exports.Battery = Battery;
  } else {
    window.Battery = Battery;
  }

})(window);
