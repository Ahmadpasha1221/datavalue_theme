/*
* Workspace page
*/

import {createApp} from "vue";
import Workspaces from './pages/Workspaces.vue';

$(document).on('workspaces-page-loaded', function () {
    createApp(Workspaces).mount($('#Workspaces-Home-Component')[0]);
});

