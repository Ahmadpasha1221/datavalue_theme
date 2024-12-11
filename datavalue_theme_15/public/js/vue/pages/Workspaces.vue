<template>
  <div class="Workspaces-Home-Component">
    <div class="workspace-tabs">
      <ul>
        <li v-for="dashboard in dashboards_list" :class="{'active':(dashboard.name==active_dashboard)}"><a @click="open_dashboard(dashboard.name)" :data-dashboard="dashboard.name">{{ frappe._(dashboard.dashboard_name) }}</a></li>
      </ul>
    </div>
    <div class="workplace-cards-widgets"></div>
    <div class="workplace-charts-widgets" v-if="active_dashboard!='Main'"></div>
    <div class="row" v-if="active_dashboard=='Main'">
      <div class="col-xl-12">
        <div class="workplace-charts-widgets"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Workspaces",
  data() {
    return {
      frappe: frappe,
      pageElements: undefined,
      active_dashboard: 'Main',
      dashboards_list: [],
    }
  },
  methods: {
    open_dashboard(name) {
      this.active_dashboard = name;
      $('.workplace-cards-widgets', this.pageElements).html('');
      $('.workplace-charts-widgets', this.pageElements).html('');
      setTimeout(() => {
        this.render_dashboard();
        this.render_events();
      }, 500);
    },
    render_dashboard() {
      frappe.call({
        type: 'GET',
        method: 'frappe.desk.form.load.getdoc',
        args: {
          doctype: 'Dashboard',
          name: this.active_dashboard
        },
        callback: (response) => {
          $('.workplace-cards-widgets', this.pageElements).html('');
          $('.workplace-charts-widgets', this.pageElements).html('');
          if (response && response.docs && response.docs[0]) {
            this.get_permitted_items('frappe.desk.doctype.dashboard.dashboard.get_permitted_cards').then(cards => {
              if (!cards.length) {
                return;
              }
              let number_cards = cards.map(card => {
                return {
                  name: card.card,
                  color: '#c00'
                };
              });
              let number_card_group = new frappe.widget.WidgetGroup({
                container: $('.workplace-cards-widgets', this.pageElements),
                type: "number_card",
                columns: 3,
                options: {
                  allow_sorting: false,
                  allow_create: false,
                  allow_delete: false,
                  allow_hiding: false,
                  allow_edit: false,
                },
                widgets: number_cards,
              });
            });
            this.get_permitted_items('frappe.desk.doctype.dashboard.dashboard.get_permitted_charts').then(charts => {
              frappe.dashboard_utils.get_dashboard_settings().then((settings) => {
                let chart_config = settings.chart_config ? JSON.parse(settings.chart_config) : {};
                let charts_widgets = charts.map((chart) => {
                  return {
                    chart_name: chart.chart,
                    label: chart.chart,
                    chart_settings: chart_config[chart.chart] || {},
                    ...chart,
                  };
                });
                let chart_group = new frappe.widget.WidgetGroup({
                  title: null,
                  container: $('.workplace-charts-widgets', this.pageElements),
                  type: "chart",
                  columns: 2,
                  options: {
                    allow_sorting: false,
                    allow_create: false,
                    allow_delete: false,
                    allow_hiding: false,
                    allow_edit: false,
                  },
                  widgets: charts_widgets,
                });
              });
            });
          }
        }
      });
    },
    render_events() {
      $("#workplace-calendar-container").show();
      this.get_events((response) => {
        let events;
        events = [];
        if (response.message.length) {
          response.message.map((event) => {
            console.log(event.starts_on, frappe.datetime.convert_to_user_tz(event.starts_on))
            events.push({
              startDate: String(frappe.datetime.convert_to_user_tz(event.starts_on)),
              endDate: (event.ends_on) ? String(frappe.datetime.convert_to_user_tz(event.ends_on)) : String(frappe.datetime.convert_to_user_tz(event.starts_on)),
              summary: event.subject,
              color: event.color,
              all_day: event.all_day,
            });
          });
        }
        let container = $("#workplace-calendar-container").simpleCalendar({
          months: [frappe._('January'), frappe._('February'), frappe._('March'), frappe._('April'), frappe._('May'), frappe._('June'), frappe._('July'), frappe._('august'), frappe._('September'), frappe._('October'), frappe._('November'), frappe._('December')],
          days: [frappe._('Sunday'), frappe._('Monday'), frappe._('Tuesday'), frappe._('Wednesday'), frappe._('Thursday'), frappe._('Friday'), frappe._('Saturday')],
          fixedStartDay: 0,
          disableEmptyDetails: true,
          events: events,
          onInit: function (calendar) {
            let element = calendar.element;
            let events = calendar.settings.events;
          },
          onDateSelect: function (date, events) {
            console.log('onDateSelect-date', date)
            console.log('onDateSelect-events', events)
          },
        });
      });
    },
    get_events(callback) {
      const $this = this;
      frappe.call({
        type: 'GET',
        method: 'datavalue_theme_15.api.get_events',
        args: {},
        callback: async function (response) {
          callback(response);
        }
      });
    },
    get_permitted_items(method) {
      return frappe.xcall(method, {dashboard_name: this.active_dashboard}).then(items => {
        return items;
      });
    },
    new_doc(doctype) {
      if (doctype && doctype.length) {
        frappe.ui.form.make_quick_entry(doctype, (doc) => {
          console.log(doc);
        });
      }
    },
    can_create(doctype) {
      return (frappe.boot.user.can_create).includes(doctype);
    },
    open_doc(doctype, docname) {
      frappe.set_route(doctype.toLowerCase(), docname)
    },
  },
  created() {
    this.pageElements = $('#page-Workspaces');
    $(document).on('page-change', () => {
      frappe.db.get_list('Dashboard', {fields: ['name', 'dashboard_name']}).then(response => {
        console.log('dashboards_list', response);
        this.dashboards_list = response;
      });
      setTimeout(() => {
        this.render_dashboard();
        this.render_events();
      }, 1000);
    });
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
