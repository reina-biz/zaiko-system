export default function SiteMaterialsPage({
  rows,
}) {

  const groupedSites =

    rows.reduce(
      (acc, row) => {

        const site =
          row.siteName ||
          "未設定";

        if (!acc[site]) {
          acc[site] = [];
        }

        acc[site].push(row);

        return acc;

      },
      {}
    );

  return (

    <div className="space-y-6">

      {Object.entries(
        groupedSites
      ).map(([site, items]) => (

        <div
          key={site}
          className="bg-white rounded-3xl shadow-sm p-6"
        >

          <h2 className="text-2xl font-bold mb-4">

            {site}

          </h2>

          <div className="overflow-hidden rounded-2xl border">

            <div className="grid grid-cols-[2fr_2fr_1fr] bg-slate-100 font-semibold text-sm">

              <div className="p-3">
                材料名
              </div>

              <div className="p-3">
                型番
              </div>

              <div className="p-3 text-right">
                使用数
              </div>

            </div>

            {items.map(
              (row, index) => (

                <div
                  key={index}
                  className="grid grid-cols-[2fr_2fr_1fr] border-t text-sm"
                >

                  <div className="p-3">
                    {row.materialName}
                  </div>

                  <div className="p-3">
                    {row.size}
                  </div>

                  <div className="p-3 text-right">
                    {row.used}
                  </div>

                </div>

              )
            )}

          </div>

        </div>

      ))}

    </div>

  );

}