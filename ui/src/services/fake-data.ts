export const fakeData = { inverter: {
    "serial": "SA2244G371",
    "request_data": {
      "time": "2025-12-31T14:19:10Z",
      "status": "Normal",
      "solar": {
        "power": 1489,
        "arrays": [
          {
            "array": 1,
            "voltage": 249.9,
            "current": 5.9,
            "power": 1489
          },
          {
            "array": 2,
            "voltage": 43.2,
            "current": 0,
            "power": 0
          }
        ]
      },
      "grid": {
        "voltage": 246.2,
        "current": 5.9,
        "power": 865,
        "frequency": 50.03
      },
      "battery": {
        "percent": 100,
        "power": 0,
        "temperature": 15,
        "voltage": 52.95
      },
      "inverter": {
        "temperature": 22.4,
        "power": 1467,
        "output_voltage": 246.8,
        "output_frequency": 50.02,
        "eps_power": 0
      },
      "consumption": 604
    },
    "meter_data": {
      "time": "2025-12-31T14:19:10Z",
      "today": {
        "solar": 7.3,
        "grid": {
          "import": 3.3,
          "export": 1
        },
        "battery": {
          "charge": 5.3,
          "discharge": 0.6
        },
        "consumption": 4.9,
        "ac_charge": 0.7
      },
      "total": {
        "solar": 6525.9,
        "grid": {
          "import": 4286.1,
          "export": 2458.8
        },
        "battery": {
          "charge": 2325.85,
          "discharge": 2325.85
        },
        "consumption": 8069.2,
        "ac_charge": 63.8
      },
      "is_metered": true
    }
  }
}