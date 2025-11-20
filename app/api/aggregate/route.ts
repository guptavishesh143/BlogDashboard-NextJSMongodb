import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { start } from "repl";

export async function GET(request: Request) {
  try {
    // const body = await request.json();
    const db = await connectDB();

    const result = await db
      .collection("dummyCollection")
      // 1️⃣ Find all rides that started at “Warren St”
      // .aggregate([{ $match: { start_station_name: "Warren St" } }]).toArray();

      // 2️⃣ Count how many rides are electric bikes
      //   .aggregate([
      //     {
      //       $match: { rideable_type: "electric_bike" },
      //     },
      //     { $count: "totalElectricBikes" },
      //   ]).toArray();

      // 3️⃣ Get only ride_id and start_station_name
      //   .aggregate([
      //     {
      //       $project: {
      //         ride_id: 1,
      //         start_station_name: 1,
      //         _id: 0,
      //       },
      //     },
      //   ]).toArray();
      // 4️⃣ Convert your string dates → Date objects
      //   .aggregate([
      //     {
      //       $addFields: {
      //         start: { $dateFromString: { dateString: "$started_at" } },
      //         end: { $dateFromString: { dateString: "$ended_At" } },
      //       },
      //     },
      //   ]).toArray();
      // 5️⃣ Calculate trip duration in minutes
      //   .aggregate([
      //     {
      //       $addFields: {
      //         start: { $dateFromString: { dateString: "$started_at" } },
      //         end: { $dateFromString: { dateString: "$ended_at" } },
      //       },
      //     },
      //     {
      //       $addFields: {
      //         durationMinutes: {
      //           $dateDiff: {
      //             startDate: "$start",
      //             endDate: "$end",
      //             unit: "minute",
      //           },
      //         },
      //       },
      //     },
      //       { $limit: 20 } // reduce output

      //   ])
      //   .toArray();
      // 6️⃣ Count rides per bike type
      //     .aggregate([{
      //         $group : {
      //             _id:"$rideable_type",
      //             total:{
      //                 $sum:1
      //             }
      //         }
      //     }]).toArray();
      // 7️⃣ Find top 5 most popular start stations
      // .aggregate([
      //   {
      //     $group: {
      //       _id: "$start_station_name",
      //       total: { $sum: 1 },
      //     },
      //   },
      //   {$sort: { total: -1 }},
      //   {$limit: 5},
      // ])
      // 8️⃣ Filter only “member” rides & show recent first
      //   .aggregate([
      //     { $match: { member_casual: "member" } },
      //     {
      //       $addFields: {
      //         start: { $dateFromString: { dateString: "$started_at" } },
      //       },
      //     },
      //     {
      //       $sort: {
      //         start: -1,
      //       },
      //     },
      //     { $limit: 5 },
      //   ])
      //   .toArray();
      // 9️⃣ Get rides per day (YYYY-MM-DD format)

      // .aggregate([

      //    { $addFields:{start:{ $dateFromString: {dateString: "$started_at"}}}},
      //    {
      //     $group:{
      //         _id: {
      //             year: { $year:"$start"},
      //             month:{ $month:"$start"},
      //             day:{ $dayOfMonth:"$start"}
      //         },
      //         total:{ $sum:1}
      //     }
      //    },
      //      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
      // ]).toArray();

      // 🔟 Group rides by member type and bike type
    //   .aggregate([
    //       {
    //       $group: {
    //         _id: { membership: "$member_casual", bike: "$rideable_type" },
    //         total: { $sum: 1 },
    //       },
    //     },
    //     { $sort: {
    //         total:-1
    //     }}
    //   ])
    //   .toArray();

// 1️⃣1️⃣ Bucket rides into duration ranges

.aggregate([
    {
        $addFields : {
            start: { dateFromString:{dateString:"$started_at"}},
            end:{dateFromString:{dateString:"ended_at"}}
        }
    },
    {
        $addFields:{
            duration:{
                $dateDiff: { startDate:"$start", endDate:"$end", unit:"minute"}
            }
        },

        { bucket:{
            groupBy :"$duration",
            
        }}
    }
])

    return NextResponse.json({
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error,
      },
      {
        status: 500,
      }
    );
  }
}
