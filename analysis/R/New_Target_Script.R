#!/usr/bin/env Rscript
#clear environment and set seed
rm(list = ls(all.names = TRUE))
set.seed(1)

library(MASS)
library(tidyverse)
library(broom)
library(TTR)

start_time <- Sys.time()
paste("Start Time:= ", start_time)

(WD <- getwd())
setwd(WD)

args <- commandArgs(trailingOnly = TRUE)
if (length(args) > 1) {
  print(args[1])
  print(args[2])
}

#read data and remove worthless columns
crypto_data <- read.csv("data.csv", header = TRUE)
adl_obv_drop <- c("ADL_slope", "OBV_slope")

#save dataframe in cache. will not use this datafrom actively in script in case reset needed and I don't want to go through all of the script again
btc_removed_adl_obv <- crypto_data[, !(names(crypto_data) %in% adl_obv_drop)]
crypto_data <- crypto_data[, !(names(crypto_data) %in% adl_obv_drop)]


#declare a bucnh of vectors for data munging and manipulation
target_vector_class <- c()
target_vector_regress <- c()
target_frame <- btc_removed_adl_obv

#vector for forward price of target variables
forward_price <- c()
current_price <- c()
dollar_gainz_boi <- c()

#vecctor for calculating difference % difference between high and low prices
high_low_fluc <- c()
x_hold <- c()
removal_names <- c()
removal_names_2 <- c()

#seq is sequence from x to y by z
#example seq(x, y, z)
estart = suppressWarnings(as.integer(args[1]))
paste('estart: ', estart)
effinish = suppressWarnings(as.integer(args[2]))
paste('effinish: ', effinish)

ehby = 5
target_time_interval_sequence <- seq(estart, effinish, ehby)
interval_seq <- .01
gain_vec <- seq(1.01, 1.25, interval_seq)
gain_append <- data.frame()
chck = TRUE

#creating vectors for targets in a regression analysis and in a classification analysis
print('Starting loops')
for (gg in gain_vec) {
  intermittent_time <- Sys.time()
  inter_elapsed = intermittent_time - start_time
  print(paste("Time @ GainVec", gg, ":=", inter_elapsed))
  for (nn in target_time_interval_sequence) {
    intermittent_time <- Sys.time()
    inter_elapsed = intermittent_time - start_time
    print(paste("Time @ time interval", nn, ":=", inter_elapsed))
    for (i in 1:(nrow(crypto_data))) {

      if (chck) {
        print('Innermost Loop Initiated.')
        chck = FALSE
      }


      #find % difference in high to low
      highLow <- crypto_data[i, 5] / crypto_data[i, 6]
      high_low_fluc[i] <- highLow

      #determine % change in forward price.
      #if forward price
      if (i < (nrow(crypto_data) - nn)) {
        t <- crypto_data[i + nn, 3]
        forward_price[i] <- crypto_data[i + nn, 3]
        current_price[i] <- crypto_data[i, 3]
        gummy <- crypto_data[i + nn, 3] - crypto_data[i, 3]
        t <- t / crypto_data[i, 3]
        target_vector_regress[i] <- t
        if (t >= gg & t < (gg + interval_seq)) {
          target_vector_class[i] <- 1
          dollar_gainz_boi[i] <- gummy
        }
        else {
          target_vector_class[i] <- 0
        }
      }
      else {
        target_vector_regress[i] <- 0
        target_vector_class[i] <- 0
        forward_price[i] <- 0
        current_price[i] <- 0
        dollar_gainz_boi[i] = 0
      }
    }

    #bind all potential target variables to dataset and to removal dataset for to remove when fitting individual models
    crypto_data <- cbind(crypto_data, target_vector_regress)
    colnames(crypto_data)[colnames(crypto_data) == "target_vector_regress"] <- paste("tvr", toString.default(nn), "_pctgain_", toString.default(gg), sep = "_")
    crypto_data <- cbind(crypto_data, target_vector_class)
    colnames(crypto_data)[colnames(crypto_data) == "target_vector_class"] <- paste("tvc", toString.default(nn), "_pctgain_", toString.default(gg), sep = "_")
    crypto_data <- cbind(crypto_data, forward_price)
    target_frame <- cbind(target_frame, target_vector_regress)
    colnames(target_frame)[colnames(target_frame) == "target_vector_regress"] <- paste("tvr", toString.default(nn), "_pctgain_", toString.default(gg), sep = "_")
    target_frame <- cbind(target_frame, target_vector_class)
    colnames(target_frame)[colnames(target_frame) == "target_vector_class"] <- paste("tvc", toString.default(nn), "_pctgain_", toString.default(gg), sep = "_")
    target_frame <- cbind(target_frame, forward_price)
    colnames(target_frame)[colnames(target_frame) == "forward_price"] <- paste("fp", toString.default(nn), "_pctgain_", toString.default(gg), sep = "_")
    target_frame <- cbind(target_frame, dollar_gainz_boi)
    colnames(target_frame)[colnames(target_frame) == "dollar_gainz_boi"] <- paste("dgb", toString.default(nn), "_pctgain_", toString.default(gg), sep = "_")

    removal_names[nn] <- paste("tvr", toString.default(nn), sep = "_")
    removal_names_2[nn] <- paste("tvc", toString.default(nn), sep = "_")
  }
}

#sum all instances for each target variable where classification target = 1
#classification target currently set to >= 4% gain in price
tar_v <- c()
tar_seq_name <- c()
tar_hours <- c()
append_future_average <- c()
append_average_gain <- c()
opportunity <- c()

ff <- 1
for (gg in gain_vec) {
  for (i in target_time_interval_sequence) {
    targ_sum <- paste("tvc", toString.default(i), "_pctgain_", toString.default(gg), sep = "_")
    #print(sum(target_frame[,which(colnames(target_frame) == targ_sum)]))
    tar_v[ff] <- sum(na.omit(target_frame[, which(colnames(target_frame) == targ_sum)]))
    append_future_average[ff] <- mean(na.omit(target_frame[, which(colnames(target_frame) == paste("fp", toString.default(i), "_pctgain_", toString.default(gg), sep = "_"))]))
    append_average_gain[ff] <- mean(na.omit(target_frame[, which(colnames(target_frame) == paste("dgb", toString.default(i), "_pctgain_", toString.default(gg), sep = "_"))]))
    opportunity[ff] <- sum(na.omit(target_frame[, which(colnames(target_frame) == targ_sum)])) * mean(na.omit(target_frame[, which(colnames(target_frame) == paste("dgb", toString.default(i), "_pctgain_", toString.default(gg), sep = "_"))]))
    tar_hours[ff] <- round(i / 60, 2)
    tar_seq_name[ff] <- targ_sum
    ff <- ff + 1
  }
}

check_targets <- data.frame()
tar_seq_name <- na.omit(tar_seq_name)
tar_v <- as.integer(na.omit(tar_v))
check_targets <- cbind(tar_seq_name, tar_hours)
check_targets <- cbind(check_targets, tar_v)
check_targets <- cbind(check_targets, append_average_gain)
check_targets <- cbind(check_targets, append_future_average)
check_targets <- cbind(check_targets, opportunity)
check_targets[which(check_targets[, "opportunity"] == max(opportunity)),]
head(check_targets[order(tar_v, decreasing = T),], 10)
# namethis <- paste(WD, agrs[2], "start", toString.default(estart), "finish", toString.default(effinish), "by", toString.default(ehby), ".csv", sep = "_")
# write.csv(check_targets, file = namethis)
nodename <- args[4]
namethis <- paste(WD, nodename, "start", toString.default(estart), "finish", toString.default(effinish), "by", toString.default(ehby), ".csv", sep = "_")
write.csv(check_targets, file = namethis)
end_time <- Sys.time()
elapsed <- end_time - start_time
paste("End Time:= ", end_time)
paste("Elapsed Time:= ", elapsed)
