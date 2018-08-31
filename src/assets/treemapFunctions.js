import { hierarchy } from 'd3-hierarchy'

export function formatData (d) {
  const tree = {
    name: d['Name'],
    children: [
      {
        name: 'Known to victims',
        children: [
          {
            name: 'Partner / Husband / Separated/ Ex',
            value: parseInt(d['Partner / Husband / Separated/ Ex'])
          },
          {
            name: 'Employer/Coworker',
            value: parseInt(d['Employer/Coworker'])
          },
          {
            name: 'Other known persons',
            value: parseInt(d['Other known persons'])
          },
          {
            name: 'Known persons on promise to marry the victim',
            value: parseInt(d['Known persons on promise to marry the victim'])
          },
          {
            name: 'Neighbors',
            value: parseInt(d['Neighbors'])
          },
          {
            name: 'Relatives',
            value: parseInt(d['Relatives'])
          },
          {
            name: 'Close Family Members',
            value: parseInt(d['Close Family Members'])
          },
          {
            name: 'Grand Father/ Father/ Brother/ Son',
            value: parseInt(d['Grand Father/ Father/ Brother/ Son'])
          }
        ]
      },
      {
        name: 'Offenders not known to victims',
        value: parseInt(d['Offenders not known to victims'])
      }
    ]
  }
  return hierarchy(tree)
    .sum(function (d) {
      return d.value
    })
}
