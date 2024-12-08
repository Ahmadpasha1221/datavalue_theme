/*
* Side Menu
*/
import { createApp } from 'vue';
import Menu from './components/Menu.vue'

createApp(Menu).mount($('#side-menu-component')[0]);

String.prototype.beginsWith = function (string) {
    return (this.indexOf(string) === 0);
};
