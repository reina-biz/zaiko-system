import { useState } from "react";

export default function PricePage({
  rows,

  companyName,
  setCompanyName,

  companyList,
}) {

  const [search, setSearch] =
    useState("");

  const currentYear =
    new Date().getFullYear();

  const [startMonth, setStartMonth] =
    useState(`${currentYear}-01`);

  const [endMonth, setEndMonth] =
    useState(`${currentYear}-12`);

  const generateMonths = () => {

    const months = [];

    const start =
      new Date(startMonth);

    const end =
      new Date(endMonth);

    const current =
      new Date(start);

    while (current <= end) {

      const year =
        current.getFullYear();

      const month =
        String(
          current.getMonth() + 1
        ).padStart(2, "0");

      months.push(
        `${year}/${month}`
      );

      current.setMonth(
        current.getMonth() + 1
      );

    }

    return months;

  };

  const months =
    generateMonths();

    

  const groupedCompanies = {};

rows

  .filter((row) => {

    if (!row.materialName) {
      return false;
    }

    if (
  companyName &&
  row.companyName !==
    companyName
) {

  return false;

}

    const rowMonth =
      row.orderDate
        ?.slice(0, 7)
        .replaceAll("/", "-");

    if (
      rowMonth < startMonth ||
      rowMonth > endMonth
    ) {
      return false;
    }

    return true;

  })

  .forEach((row) => {

    const company =
      row.companyName || "未設定";

    const key =

      `${row.materialName}_${row.size}`;

    const month =
      row.orderDate
        ?.slice(0, 7)
        .replace("-", "/");

    if (!groupedCompanies[company]) {

      groupedCompanies[company] = {};

    }

    if (

      !groupedCompanies[company][key]

    ) {

      groupedCompanies[company][key] = {

        name:
          row.materialName,

        size:
          row.size,

        prices: {},

      };

    }

    groupedCompanies[company][key]

      .prices[month] = row.price;

  });

  return (

    <div className="bg-white rounded-3xl shadow-sm p-6">

      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div>

          <label className="block text-sm font-medium mb-2">
            会社名
          </label>

          <select
            value={companyName}
            onChange={(e) =>
              setCompanyName(
                e.target.value
              )
            }
            className="w-full border rounded-2xl px-4 py-3 bg-white"
          >

            <option value="">
              会社選択
            </option>

            {companyList.map((company) => (

              <option
                key={company}
                value={company}
              >
                {company}
              </option>

            ))}

          </select>

        </div>

        <div>

          <label className="block text-sm font-medium mb-2">
            開始年月
          </label>

          <input
            type="month"
            value={startMonth}
            onChange={(e) =>
              setStartMonth(e.target.value)
            }
            className="w-full border rounded-2xl px-4 py-3"
          />

        </div>

        <div>

          <label className="block text-sm font-medium mb-2">
            終了年月
          </label>

          <input
            type="month"
            value={endMonth}
            onChange={(e) =>
              setEndMonth(e.target.value)
            }
            className="w-full border rounded-2xl px-4 py-3"
          />

        </div>

      </div>

      <div className="mb-6">

        <input
          type="text"
          placeholder="材料名検索"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded-2xl px-4 py-3"
        />

      </div>

      <div className="text-2xl font-bold text-black mb-6 ml-1">

  {companyName || "全会社"}

</div>
      <div className="overflow-auto rounded-2xl border bg-white">

        <table className="w-full text-sm min-w-[1400px]">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left whitespace-nowrap">
                材料名
              </th>

              <th className="p-4 text-left whitespace-nowrap">
                型番・サイズ
              </th>

              {months.map((month) => (

                <th
                  key={month}
                  className="px-2 py-3 text-right whitespace-nowrap"
                >
                  {month}
                </th>

              ))}

            </tr>

          </thead>

<tbody>

  {Object.entries(groupedCompanies)

    .map(([company, materials]) => (

      

    <>

      <tr className="bg-slate-200">

        <td

          colSpan={
            months.length + 2
          }

          className="
            p-4
            font-bold
            text-lg
          "
        >

          {company}

        </td>

      </tr>

      {Object.values(materials)

        .filter((item) => {

          const keywords =
            search
              .toLowerCase()
              .split(" ")
              .filter(Boolean);

          return keywords.every(

            (keyword) =>

              item.name

                .toLowerCase()

                .includes(keyword)

          );

        })

        .map((item, index) => (

          <tr
            key={index}
            className="
              border-t
              hover:bg-slate-50
            "
          >

            <td className="p-4 whitespace-nowrap">

              {item.name}

            </td>

            <td className="p-4 whitespace-nowrap">

              {item.size}

            </td>

            {months.map((month) => (

              <td
                key={month}
                className="
                  px-2
                  py-3
                  text-right
                  whitespace-nowrap
                "
              >

                {item.prices[month]

                  ? `¥${Number(
                      item.prices[month]
                    ).toLocaleString()}`

                  : "-"

                }

              </td>

            ))}

            

          </tr>

        ))}

    </>

))}

</tbody>


        </table>

      </div>

    </div>

  );
}