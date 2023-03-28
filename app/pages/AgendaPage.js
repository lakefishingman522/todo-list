import React, { useState } from "react";
import { View, TouchableOpacity, useWindowDimensions } from "react-native";
import { Agenda } from "react-native-calendars";
import AppRow from "../components/AppRow";
import AppText from "../components/AppText";
import { getDates } from "../config/utilities";

const AgendaPage = ({ navigation, route }) => {
  const { width, height } = useWindowDimensions();

  const [items, setItems] = useState({});
  let now = new Date();

  let from = new Date(now.setMonth(now.getMonth() - 1));
  let to = new Date(now.setMonth(now.getMonth() + 3));

  from.setFullYear(from.getFullYear(), from.getMonth(), 1);
  to.setFullYear(to.getFullYear(), to.getMonth(), 1);

  const loadItems = (day) => {
    setTimeout(() => {
      let items = getDates(from, to);
      const newItems = {};

      items.forEach((key) => {
        newItems[key] = new Array(0);
      });

      route.params.forEach((item) => {
        let emote = "";
        switch (item.categories[0]) {
          case "Meeting":
            emote += "🤝\n";
            break;

          case "Review":
            emote += "📈\n";
            break;

          case "Marketing":
            emote += "🔊\n";
            break;

          case "Design Project":
            emote += "🎨\n";
            break;

          case "College":
            emote += "🎓\n";
            break;

          case "Movie":
            emote += "🍿\n";
            break;

          default:
            emote += "📝";
            break;
        }
        item.emote = emote;
        newItems[item.date] &&= [...newItems[item.date], item];
        newItems[item.date] ||= [item];
        if (newItems[item.date].length > 1) {
          newItems[item.date].sort((a, b) => {
            if (a.dueDate - b.dueDate < 0) return -1;
            else if (a.dueDate - b.dueDate > 0) return 1;
            else return 0;
          });
        }
      });

      setItems({ ...newItems });
    }, 1000);
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          {
            marginHorizontal: 10,
            marginTop: 17,
            backgroundColor: "white",
            elevation: 5,
          },
          !item.completed ? { shadowColor: "red" } : { shadowColor: "green" },
        ]}
      >
        <AppRow
          // justifyContent="space-between"
          alignItems="center"
          style={{ padding: 20 }}
        >
          <View
            style={{
              borderRadius: 15,
              width: "90%",
            }}
          >
            <AppText style={{ fontSize: 20 }}>
              {new Date(item.dueDate).toString().slice(16, 21)}
            </AppText>
            <AppText style={{ fontSize: 12 }}>{item.categories[0]}</AppText>
            <AppText style={{ fontSize: 12 }}>{item.title}</AppText>
          </View>

          <AppText
            style={{
              height: height * 0.05,
              width: width * 0.1,
              fontSize: 25,
              alignSelf: "flex-start",
            }}
          >
            {item.emote}
          </AppText>
        </AppRow>
        <AppText
          style={{
            position: "absolute",
            fontSize: 10,
            bottom: 5,
            right: 5,
          }}
        >
          Created On: {new Date(item.createdDate).toISOString().slice(0, 10)}
        </AppText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, marginTop: 40 }}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={new Date().toISOString().slice(0, 10)}
        renderItem={renderItem}
        scrollEventThrottle={16}
        pastScrollRange={2}
        futureScrollRange={2}
        maxDate={to.toISOString().slice(0, 10)}
        minDate={from.toISOString().slice(0, 10)}
      />
    </View>
  );
};

export default AgendaPage;
