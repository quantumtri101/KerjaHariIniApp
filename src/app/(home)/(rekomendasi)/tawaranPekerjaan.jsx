import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import React, {useState, useEffect, } from 'react'
import moment from 'moment'

import { Card, Skeleton } from '../../../components';
import { COLORS, FONTSTYLES, SIZES } from '../../../constants';
import useFetch from '../../../hook/useFetch';
import Base from "../../../utils/base";

export default function TawaranPekerjaan(props) {
  var base = new Base()
  const getRecommendation = useFetch('GET', 'jobs?api_type=offering&is_live_app=1&is_approve=1', {})
  const [arrJobs, setArrJobs] = useState([]);

  useEffect(() => {
    if(getRecommendation.data.status != null){
      if(getRecommendation.data.status == 'success'){
        for(let data of getRecommendation.data.data){
          for(let shift of data.shift){
            shift.start_date_moment = moment(shift.start_date)
            shift.end_date_moment = moment(shift.end_date)
          }
        }
        setArrJobs(getRecommendation.data.data)
      }
      else
        base.alertSnackbar(getRecommendation.data.message)
    }
  }, [getRecommendation.data]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white', }}>
      {
        arrJobs.length == 0 ?
        <Text style={[styles.empty, {marginHorizontal: 0, marginTop: 16, }]}>Belum ada tawaran pekerjaan untuk anda saat ini</Text>
        :
        <FlatList
          ListHeaderComponent={<Text style={styles.title}>{getRecommendation.data.recordsFiltered} Tawaran Pekerjaan</Text>}
          ListFooterComponent={() => <View style={{ height: SIZES.medium }} />}
          ItemSeparatorComponent={() => <View style={{ height: SIZES.medium }} />}
          refreshControl={<RefreshControl refreshing={getRecommendation.isLoading} onRefresh={() => getRecommendation.refetch()} />}
          data={arrJobs}
          renderItem={({ item, index }) =>
            getRecommendation.isLoading ?
              <Skeleton negWidth={SIZES.medium*2} height={157} borderRadius={8} style={{ marginHorizontal: 16 }} />
            :
              <Card.Jobs data={item} key={index} from={'rekomendasi'} navigation={props.navigation}/>
          }
          style={{ flex: 1, backgroundColor: COLORS.white }}
        />
      }
      
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    ...FONTSTYLES.topTabBar_Active,
    paddingHorizontal: SIZES.medium,
    paddingTop: SIZES.medium,
    paddingBottom: SIZES.xSmall
  },
  empty: {
    ...FONTSTYLES.p_black_12,
    paddingHorizontal: SIZES.medium
  }
})