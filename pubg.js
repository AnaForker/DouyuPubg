var net = require("zhynet");
var fs = require("fs");
var Net = new net();
var rooms = new Object();
var promises = [];
var promises2 = [];
var count = 0;
var exist = fs.existsSync;
var write = fs.writeFileSync;
var read = fs.readFileSync;
var storage = "rooms.txt";

if (!exist(storage))
	for (let i = 0; i < 300; i++)
		promises.push(Net.post("https://m.douyu.com/roomlists", "type=jdqs&page=" + i).then((rm) => {
				let obj = JSON.parse(rm).result;
				obj.forEach((item) => {
					rooms[item.room_id + "_"] = {};

					rooms[item.room_id + "_"].name = item.room_name
						rooms[item.room_id + "_"].left = "999";
					//console.log(rooms);
				});
			}).catch ((err) => {})
				); else
				promises.push(new Promise((yes) => {
						rooms = JSON.parse(read(storage));
						yes();
					}));

			Promise.all(promises).then(() => {

				//console.log(rooms);
				let tmp = Object.getOwnPropertyNames(rooms);
				let rms = [];
				tmp.forEach((rm) => {
					if (rm.indexOf("_") != -1)
						rms.push(rm);

				});
				let len = rms.length;

				for (let i = 0; i < len; i += 50) {
					let str = "";
					for (let j = i; j < (i + 50 >= len ? len : i + 50); j++) {

						str += rms[j].substring(0, rms[j].length - 1) + ",";
					}
					str = str.substring(0, str.length - 1);

					promises2.push(Net.get("https://www.douyu.com/ggwapi/rnc/mgeticon?rids=" + str + "&flags=1&client_sys=web").then((data) => {

							let obj = JSON.parse(data).data;
							obj.forEach((ob) => {
						
								if (ob.icp == "https://cs-op.douyucdn.cn/douyu/2018/01/17/4d8afc845a4ff711fe68695c62ca8ad0.png")
									rooms[ob.rid + "_"].left = "11";
								if (ob.icp == "https://cs-op.douyucdn.cn/douyu/2018/01/17/f74d3851a853ffb103302ecca684c9ea.png")
									rooms[ob.rid + "_"].left = "12";
								else if (ob.icp == "https://cs-op.douyucdn.cn/douyu/2018/01/31/87f9631db3233b49113d9dec09d6d3f3.png")
									rooms[ob.rid + "_"].left = "10";
								else
									rooms[ob.rid + "_"].left = (net.substr(ob.icp, "https://cs-op.douyucdn.cn/douyu/2018/01/dc4c44f624d600aa568390f1f1104aa0/", ".png"))

							});

						
						}));

				}
				Promise.all(promises2).then(() => {

					write(storage, JSON.stringify(rooms));
					let display = []
					rms = Object.getOwnPropertyNames(rooms);
					rms.forEach((rm) => {
						let obj = {};
						obj.left = rooms[rm].left;

						obj.name = rooms[rm].name;
						obj.id = rm;

						display.push(obj);

					});
					display.sort((a, b) => {
						return b.left - a.left;

					}).forEach((item) => {
						if (item.left == "10")
							item.left = "决赛圈";
						if (item.left == "999")
							item.left = "无";
						console.log(item)
					});
					console.log("以上总共" + rms.length + "个主播")

				});

			});
