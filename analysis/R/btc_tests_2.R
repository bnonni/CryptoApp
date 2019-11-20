#clear environment and set seed
rm(list = ls(all.names = TRUE))
set.seed(1)
setwd("//Users//armandk//Desktop//Personal Projects//Crypto Modeling")
library(glmnet)
library(MASS)
library(tidyverse)
library(broom)
library(glmnet)
library(cvTools)
library(TTR)
library(randomForest)

#read data and remove worthless columns
crypto_data <- read.csv("data.csv", header = TRUE)
adl_obv_drop <- c("ADL_slope","OBV_slope")

#save dataframe in cache. will not use this datafrom actively in script in case reset needed and I don't want to go through all of the script again
btc_removed_adl_obv <- crypto_data[,!(names(crypto_data) %in% adl_obv_drop)]
crypto_data <- crypto_data[,!(names(crypto_data) %in% adl_obv_drop)]
head(crypto_data)

#declare a bucnh of vectors for data munging and manipulation
target_vector_class <- c()
target_vector_regress <- c()

#vector for forward price of target variables
forward_price <- c()
current_price <- c()
dollar_gainz_boi <- c()

#vecctor for calculating difference % difference between high and low prices
high_low_fluc <- c()
x_hold <- c()
removal_names <-c()
removal_names_2 <- c()

#seq is sequence from x to y by z
#example seq(x, y, z)
target_time_interval_sequence <- seq(500,600,100)
interval_seq <- .02
gain_vec <- seq(1.1,1.24,.interval_seq)
gain_append <- c()

#creating vectors for targets in a regression analysis and in a classification analysis
for (gg in gain_vec){
  for (nn in target_time_interval_sequence){
    for(i in 1:(nrow(crypto_data))){
      #find % difference in high to low
      highLow <- crypto_data[i,5]/crypto_data[i,6]
      high_low_fluc[i] <- highLow
      
      #determine % change in forward price.
      #if forward price
      if (i < (nrow(crypto_data)-nn)){
        t <- crypto_data[i+nn,3]
        forward_price[i] <- crypto_data[i+nn,3]
        current_price[i] <- crypto_data[i,3]
        t <- t/crypto_data[i,3]
        target_vector_regress[i] <- t
        if (t >= gg & t < (gg+interval_seq)){
          target_vector_class[i] <- 1 
          dollar_gainz_boi[i] <- (as.integer(crypto_data[i+nn,3]) - as.integer(crypto_data[i,3]))
        }
        else{
          target_vector_class[i] <- 0
        }
      }
      else{
        target_vector_regress[i] <- 0
        target_vector_class[i] <- 0
        forward_price[i] <- 0
        current_price[i]<-0
        dollar_gainz_boi[i] = 0
      }
    }
    
    #bind all potential target variables to dataset and to removal dataset for to remove when fitting individual models
    crypto_data <- cbind(crypto_data,target_vector_regress)
    colnames(crypto_data)[colnames(crypto_data)=="target_vector_regress"] <- paste("tvr",toString.default(nn),"_pctgain_",toString.default(gg),sep="_")
    crypto_data <- cbind(crypto_data,target_vector_class)
    colnames(crypto_data)[colnames(crypto_data)=="target_vector_class"] <- paste("tvc",toString.default(nn),"_pctgain_",toString.default(gg),sep="_")
    crypto_data <- cbind(crypto_data,forward_price)
    colnames(crypto_data)[colnames(crypto_data)=="forward_price"] <- paste("fp",toString.default(nn),"_pctgain_",toString.default(gg),sep="_")
    crypto_data <- cbind(crypto_data,dollar_gainz_boi)
    colnames(crypto_data)[colnames(crypto_data)=="dollar_gainz_boi"] <- paste("dgb",toString.default(nn),"_pctgain_",toString.default(gg),sep="_")
    
    removal_names[nn] <- paste("tvr",toString.default(nn),sep="_")
    removal_names_2[nn]<- paste("tvc",toString.default(nn),sep="_")
  }
} 

# #calculate one min RSIs for modeling
# ff<-14
# for (i in 1:20){
#   new_RSI <- RSI(crypto_data[,"Prices"],n=ff)
#   crypto_data <- cbind(crypto_data,new_RSI)
#   colnames(crypto_data)[colnames(crypto_data)=="new_RSI"] <- paste("newRSI",toString.default(ff),sep="_")
#   ff = ff+1
# }
# 
# #calculate one min rate of change values for modeling
# ff<-1
# for (i in 1:20){
#   price_rate_change <- ROC(crypto_data[,"Prices"],n=ff)
#   crypto_data <- cbind(crypto_data,price_rate_change)
#   colnames(crypto_data)[colnames(crypto_data)=="price_rate_change"] <- paste("price_rate_change",toString.default(ff),sep="_")
#   ff = ff+1
# }
# 
# #calculate one min simple moving average values for modeling
# ff<-1
# for (i in seq(5,70,5)){
#   simp_ma_price <- SMA(crypto_data[,"Prices"],n=ff)
#   crypto_data <- cbind(crypto_data,simp_ma_price)
#   colnames(crypto_data)[colnames(crypto_data)=="simp_ma_price"] <- paste("simp_ma_price",toString.default(i),sep="_")
#   ff = ff+1
# }

#sum all instances for each target variable where classification target = 1 
#classification target currently set to >= 4% gain in price
tar_v <- c()
tar_seq_name <-c()
tar_hours <- c()
append_future_average <-c()
append_average_gain <-c()

ff<-1
for (gg in gain_vec ){
  for (i in target_time_interval_sequence){
    targ_sum <- paste("tvc",toString.default(i),"_pctgain_",toString.default(gg),sep="_")
    print(sum(crypto_data[,which(colnames(crypto_data) == targ_sum)]))
    tar_v[ff] <- sum(crypto_data[,which(colnames(crypto_data) == targ_sum)])
    append_future_average[ff] <- mean(crypto_data[,which(colnames(crypto_data) == paste("fp",toString.default(i),"_pctgain_",toString.default(gg),sep="_"))])
    append_average_gain[ff] <- mean(crypto_data[,which(colnames(crypto_data) == paste("dgb",toString.default(i),"_pctgain_",toString.default(gg),sep="_"))])
    tar_hours[ff] <- round(i/60,2)
    tar_seq_name[ff] <- targ_sum
    ff <-ff+1
  }
}
check_targets <- data.frame()
tar_seq_name<- na.omit(tar_seq_name)
tar_v <- as.integer(na.omit(tar_v))
check_targets <- cbind(tar_seq_name, tar_hours)
check_targets <- cbind(check_targets,tar_v)
check_targets <- cbind(check_targets,append_average_gain)
check_targets <- cbind(check_targets,append_future_average)
check_targets[which(check_targets[,"tar_v"] == max(tar_v)),]
head(check_targets[order(tar_v, decreasing = T),],10)