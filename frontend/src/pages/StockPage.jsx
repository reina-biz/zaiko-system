import { useState } from "react";

export default function StockPage({
  rows,

  companyName,
  setCompanyName,

  companyList,
}) {

  const [search, setSearch] =
    useState("");

  const [selectedItems, setSelectedItems] =
    useState([]);

  const currentYear =
    new Date().getFullYear();

  const [startMonth, setStartMonth] =
    useState(`${currentYear}-01`);

  const [endMonth, setEndMonth] =
    useState(`${currentYear}-12`);

  const groupedRows = {};

  rows

    .filter((row) => {

      if (!row.materialName) {
        return false;
      }

      if (
        companyName &&
        row.companyName !== companyName
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

      const key =

  `${row.materialName}_${row.size}`;

if (!groupedRows[key]) {

        groupedRows[key] = {
          size: row.size,
          quantity: 0,
          orderQuantity: 0,
          latestPrice: row.price,
        };

      }

      groupedRows[key]
        .orderQuantity +=
        Number(row.quantity || 0);

      groupedRows[key]
        .quantity +=
        Number(row.quantity || 0)
        - Number(row.used || 0);

      groupedRows[key]
        .latestPrice =
        row.price;

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

      <h2 className="text-2xl font-bold mb-6">
        在庫管理
      </h2>

      <div className="overflow-auto rounded-2xl border bg-white">

        <table className="w-full text-sm min-w-[1200px]">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">
                材料名
              </th>

              <th className="p-4 text-left">
                型番・サイズ
              </th>

              <th className="p-4 text-right">
                最新単価
              </th>

              <th className="p-4 text-right">
                注文数
              </th>

              <th className="p-4 text-right">
                使用数
              </th>

              <th className="p-4 text-right">
                現在在庫
              </th>

            </tr>

          </thead>

          <tbody>

            {Object.entries(groupedRows)

              .filter(([name]) => {

                const keywords =
                  search
                    .toLowerCase()
                    .split(" ")
                    .filter(Boolean);

                return keywords.every((keyword) =>

                  name
                    .toLowerCase()
                    .includes(keyword)

                );

              })

              .map(([name, item]) => (

                <tr
                  key={name}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="p-4 whitespace-nowrap">
                    {name}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    {item.size}
                  </td>

                  <td className="p-4 text-right whitespace-nowrap">
                    ¥{Number(
                      item.latestPrice || 0
                    ).toLocaleString()}
                  </td>

                  <td className="p-4 text-right">
                    {item.orderQuantity.toLocaleString()}
                  </td>

                  <td className="p-4 text-right">
                    {(
                      item.orderQuantity -
                      item.quantity
                    ).toLocaleString()}
                  </td>

                  <td className="p-4 text-right font-semibold">
                    {item.quantity.toLocaleString()}
                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}