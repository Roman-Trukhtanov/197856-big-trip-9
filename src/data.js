const getAllCities = (wayPoints) => wayPoints.map((wayPoint) => wayPoint.destination.name);

const getTimes = (wayPoints) => ({
  startDate: wayPoints[0].time.startTime,
  endDate: wayPoints[wayPoints.length - 1].time.endTime,
});

export const getInfoData = (data) => ({
  cities: getAllCities(data),
  times: data.length > 0 ? getTimes(data) : null,
});

export const getMenuData = () => [
  {
    title: `Table`,
    isActive: true,
  },
  {
    title: `Stats`,
    isActive: false,
  },
];

export const getFiltersData = () => [
  {
    title: `everything`,
    isChecked: true,
  },
  {
    title: `future`,
    isChecked: false,
  },
  {
    title: `past`,
    isChecked: false,
  },
];
